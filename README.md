# Mathsweeper
Mathsweeper is the ultimate challenge for Minesweeper fans. Instead of numbers, the game features math problems that guide you as you try to clear the board. Flag mines with a long click, and see how fast you can solve the puzzles. Can you master Mathsweeper, or will it defeat you first?

![mine (1)](https://user-images.githubusercontent.com/105588693/210266675-4e9e16c8-a973-4a62-818d-5bdc15283c8d.png)

## Play it

You can play the game [here](https://neontomo.com/play/mathsweeper/).

## Why did I build this?

As a kid, I watched as my mother played this game on the computer, but struggled to understand the rules. It amazed me how she played it on professional mode without making any mistakes, flagging bombs as she went. As I got a bit older, I too started to play, and soon realised that once you know the rules, it's quite difficult to lose (except in the few cases where the game leaves you with a coin-flip situation). You just need to take your time, skip the tricky areas until you've cleared more elsewhere, flag obvious bombs, identify a few patterns, and soon enough you have a finished game. This motivated me to spend some time thinking about how to make the game slower and more challenging, in the hope that my mother would enjoy playing it.

## What did I learn?

I learned that it's quite difficult to generate random equations that lead to a specific answer. I only wanted to have the solutions be equal to `0`, `1`, `2` and so on. Numbers that could plausibly be bomb numbers, which excluded high numbers. How do you create an equation function that starts with the solution and creates the problem? `1 = -50 + 275 - 224` for example. In the end I managed to create a few variations of equations, and it was a fun problem to solve. I still think there is more to improve on. Here is one of the functions I used to generate an equation for multiplication:
```
function multiply(num) {
	if (num == 0 || num == 1) {
    // pick a different method, as it's too easy
		return randomCalc(num);
	}
	var r = randomInteger(10, 100);
	return 'Solve X:<br />' + r + 'x = ' + (r * num);
}
```

Another difficulty was in making sure the first click was a safe one, which meant generating all the bombs *after* that click, or moving them around a bit if you accidentally click on one. Sometimes problems seem easy when I set out to solve them, but then I end up knee-deep in bogwater trying to get unstuck. This was one of those times. I learned that I needed to be a bit more systematic and slow with my approach and make sure I had the right results at every step of the way, instead of trying to speedhack it.
