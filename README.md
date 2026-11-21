# makefun-best-spot-the-difference-game-20261121-0451

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/tngrha/makefun-best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/tngrha/makefun-best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

**Twin Postcards** — an original spot-the-difference game. Three code-drawn postcard scenes
(Harbor Dawn, Forest Camp, Night Market), each shown twice side by side with planted
differences: 7, then 9, then 11, on tightening countdowns (150s / 120s / 90s). Click either
picture to mark a find — a ring and tick land on both postcards with a chime. Wrong clicks
cost points and shake the panel; three hints per scene pulse a gold ring around a hidden
difference. Finish all three scenes to unlock **Remix**: shuffled scene order and swapped
postcards for a fresh hunt. Pure HTML/CSS/JS canvas, no libraries, no network, synthesized
WebAudio sounds.

## Run it

```sh
cd game && python3 -m http.server 8080   # then open http://localhost:8080
# hand-in program (writes game/, screenshots/, dossier.json to /output):
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=px8mhdxd&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
