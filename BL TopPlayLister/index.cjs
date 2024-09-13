const fs = require("fs");
const config = require("../config.json")

const main = async function() {
  let url = `https://api.beatleader.xyz/player/${config.playerId}/scores/compact?sortBy=pp&order=desc&page=1&count=${config.topPlayCount}&type=ranked`;

  try {
    const resp = await fetch(url);
    if (!resp.ok) {
      return false
    }

    const json = await resp.json();

    let playlist = {
      playlistTitle: `TopPlays BL (${config.topPlayCount})`,
      playlistAuthor: "PixlPainter",
      image: " data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAASbSURBVHhe7ZpHyO1EGEB/e8WGCqJiRcGCHVFRsGFZWR6KbWEDy0JRUHEjiIpt48aFKFhwo6AiiIIFQXFlxYoFewN773rOvRkZ4/zJZJLHi74cOCR/yXeTuZmZb75kYWJiYmJiYvllpWpbx9/vhDviBvgV/oZDsjHuilvPflpY+LraDsUKuAN6HRui1/ArtnIQPok/4p/oQc/jcTgEa+KV+CEaX7/AW3FTHIK98RH8AY3vl/cinoyNHIs/YzixuudjH1bH+zEVW1/CzbEPB+M3mIqvF2MSP/hjTB0U/An3xFIuxVTc2LuwlPXwNUzFDXpH74v/4kJMHVD3RixhHXwDUzFj7Xo7Ywne4qmYdW/BGStWW9mn2raxFy42eDaxDW4x323EbrLLfLcz9v0c9sBV3IkbwMEphzWwpAG8sNmHZuD/lpB7DcafXUPcAG9V2zbexV/mu51wfPlyvtvK+9W2K29W2zbeQ8ezf3AIpvpL3TOwlPswFTP2dVwXS7DreGGpuLHnYJLbMXVA8DEsvT1lNzQhScUOnoB9uBZTcYNP4KJdZW28A+sH/YEP4ibYF++0t7H+GWaCZ2NfVsYbsB5fH8bNsBWzQTOpcOA7uD4Ohen19Whss7TrcDscCpOhcO7O+7fhUZg7CM84HEMQPQmH5Gg0rpnntv5iQB7AcN4mRqtikngWqONgFC9QLsA+/b9OuGi/lSG6VsBv/4j57oxXcdFZq6kBPkD7amB3PHG+OwhbVltXbX3z/xhzfWMGnqm2SZoawFZzFRhzCQ41FsS3fWiMvizBQ+e7f/NstS3iXAx9KXgF9sV1gYlXiHkn9sWYribjc3XK3QqLcdX0O8ZBv0O7Qx8shMTL7udwNeyDX0x8niHuogNgDhthXLgIPo59Ap+FcbxvcXssZT8MBZxYE7vePIr1wHo5lnIv1uOdhiVYA3CsqsfT87A3Jimp4HYNk4uuOOB9jvV4VopKaErfD8DeHI+p4OqFWB/ogjNJKpZji0XYLlyGqVj6KQ6SX1hZDcXFlC6PHdRysBLs/6fi6E2YS1sFy8Ju0zSfzVr4CqY+JOha/zBs42ZMHR90XXAkNmEh42pMHR9bWrpLcjemPiTWae0qtAZfx2/Cv6WOq/sJHogp7G7xIq3JU7GVOGVs4iK8Zr7bitWWe/AptN7vg49TcH/MxSnNwe0hdGwwhvm95uQLofL79OynAcitFo1FxxmX3K3kDhIuKT+b7/4n8Hy9+1rJbYCPMLfgOAZMgbPIbQBLYtlBR0D2CrDLPDnYgLKUcQB1VZhFlwZ4AbMeLy9jnIUcBLPo0gCu310Zjp2X8fv5bjtdGsDighnh2OlUAerSANJYXxsJy3UDeJeaA2TTtQEcXX37Yqz4AKfTONW1ASyVO8qOFd8D6vTkOncxFGOFyEqQq78x4SLJl6982SqbkgZwPe4DSBcdY8Jr8dsf23lNjJqSLuCjJ+sDY0uL7ZoWUXwYulRpewNjWXoMdqLrNChjXhD5rKITJQ3wv2JqgGq73FLSACZBY6Xz9ZRMg2fi6Ti2VNh3jXx+4SOxiYmJiYmJiTYWFv4Ccf0fVZbnbogAAAAASUVORK5CYII=",
      songs: []
    }

    for (let entry of json.data) {
      let diffName = "";
      const difficulty = entry["leaderboard"]["difficulty"];
      if (difficulty === 9) {
        diffName = "expertPlus";
      } else if (difficulty === 7) {
        diffName = "expert";
      } else if (difficulty === 5) {
        diffName = "hard";
      } else if (difficulty === 3) {
        diffName = "normal";
      } else if (difficulty === 1) {
        diffName = "easy";
      }
      const map = {
        hash: entry["leaderboard"]["songHash"],
        difficulties: [
          {
            name: diffName,
            characteristic: entry["leaderboard"]["modeName"]
          }
        ]
      }
      playlist.songs.push(map);
    }

    fs.writeFileSync("./topplays.json", JSON.stringify(playlist, null, 2));
  } catch (e) {
      console.log(e);
      return false;
  }
  return true;
}
main().then(r => r === true ? console.log("Fetching Top Plays was successful!") : console.log("Fetching Top Plays failed!"));
