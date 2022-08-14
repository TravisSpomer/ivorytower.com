const voteStrings: [string, string][] =
[
	["Up", "Down"],
	["Like", "Dislike"],
	["Want", "DO NOT WANT"],
	["Fuck yeah", "What the fuck"],
	["Megan Fox hot pixxx", "Michael J. Fox hot pixxx"],
	["Phat", "Fat"],
	["Lemonade", "Lemon party"],
	[":)", ":("],
	["Sports Illustrated swimsuit edition", "Cabela’s catalog swimsuit edition"],
	["Rocks", "Sucks"],
	["Win", "Fail"],
	["Fist bump", "Pissed chump"],
	["Reward", "Punish"],
	["FTW", "FTL"],
	["Post of the year", "Die in a fire"],
	["Like", "Pat Buchanan"],
	["Free Pony", "Dead Horse"],
	["Rich creamery butter", "Salad"],
	["Shrubbery", "Ni!"],
	["Gold medal", "Not impressed"],
	["That’s what she said", "No it isn’t"],
	["Increment", "Decrement"],
	["Dope", "Wack"],
	["Great success", "FAIL"],
	["This was a triumph", "A lie"],
	["Like", "Like (on opposite day)"],
	["Beautiful mountain wildflowers", "OH SHIT SPIDERS"],
	["Exceptional", "Unhandled exception"],
	["+1", "-1"],
	["Upvote", "Downvote"],
	["Good news everyone!", "Your post is bad and you should feel bad"],
	["yayayayay", "meh"],
	["Priceless artifact", "JPEG artifact"],
	["Touché", "Toupée"],
	["Great White Shark", "Mediocre White Shark"],
	["The cool, refreshing taste of Coke Zero® [SPONSORED]", "Shasta®"],
	["A Diet Coke, please.", "Is Pepsi okay?"],
	["Prince Charming", "Nigerian prince"],
	["The Dark Knight", "Batman v Superman"],
	["1 like", "1 prayer"],
	["Sowing", "Reaping"],
	["++", "--"],
	["Love", "Fear"],
	["Great", "“Great”"],
	["Bosch dishwasher", "Non-Bosch dishwasher"],
]

/** Returns a pair of upvote/downvote strings. */
export function getVoteStrings(index1: number, index2: number = 0): Readonly<[string, string]>
{
	return voteStrings[(index2 * 31 + index1) % voteStrings.length]
}

/** Returns a random pair of upvote/downvote strings. */
export function getRandomVoteStrings(): Readonly<[string, string]>
{
	return voteStrings[Math.floor(Math.random() * voteStrings.length)]
}
