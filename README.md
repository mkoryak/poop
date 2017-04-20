Running this cod
----------------

You will need node 7.x.x, the best way to install it without breaking your world is using `n`

(disclaimer, I didn't do this, going from memory here)
`npm i n -g`
`n list`
`n 7.9.0`

now you are on the node version needed to run this! run this:

`npm i`
`npm start`

to run tests:
`npm test`

Things I learned while doing this
---------------------------------

This was the first time I did any real work with generators in js. I was originally going to use streams, but streams
are so node 0.12

I really wanted to do this without buffering as little as possible, which is why I chose generators. In retrospect,
I would _have_ to buffer in order to solve any of the problems (and if not, please tell me how). I get some memory savings
by never instantiating non-unique name objects.

I also went for the more verbose "object oriented" approach. That is silly since the homework wanted the code to be as
compact as possible. Sorry about that. I could have done it all in a loop like this guy: https://github.com/shauncarland/actor_name_program/blob/master/actor_name_program.rb
but then I wouldn't get to learn anything new.

(On a side note, I would love to know why his program skips some perfectly valid names.
I couldn't find any bugs in the parsing code, but I also don't know ruby.)

I also sort all output. Maybe that is wrong. Sorry about that.

I probably could have written more tests and found more bugs, but I have another homework to do after this one.


output
------

*Unique first names:* 3007
*Unique last names:* 468
*Unique full names:* 48432

*Unique names (25):*
Agustina Lang
Anita Ortiz
Berry Koch
Bethel Shanahan
Colby Rogahn
Davin Stanton
Donna Stoltenberg
Elmo Fisher
Garfield Marvin
Gertrude Kunze
Lennie Bahringer
Luis Adams
Madison Tillman
Mariah McLaughlin
Matilde Lehner
Mckenna Graham
Nicolas Cartwright
Nikko Bradtke
Norma Lynch
Roy Runolfsdottir
Ryley Tromp
Samanta Hills
Sonya Dickinson
Stanley Hoppe
Thad McGlynn

*Modified unique names (25):*
Addie Tromp
Addison Stoltenberg
Ahmad Adams
Alfonzo Graham
Braden Bradtke
Cary McGlynn
Delbert Hills
Delta Tillman
Destin McLaughlin
Efrain Shanahan
Furman Fisher
Garfield Boehm
Grady Rogahn
Johann Hoppe
Kane Stanton
Katharina Dickinson
Lennie Cummerata
Marilou Runolfsdottir
Raleigh Ortiz
Robyn Lynch
Rose Kunze
Royce Koch
Sydnie Lehner
Verona Cartwright
Xander Lang

*Ten most common last names:*
Barton -> 143
Lang -> 136
Ortiz -> 135
Hilll -> 134
Hills -> 130
Terry -> 129
Romaguera -> 128
Becker -> 128
Johns -> 128
Batz -> 127

*Ten most common first names:*
Tara -> 32
Stephania -> 31
Andreanne -> 31
Keon -> 31
Kaycee -> 30
Madyson -> 29
Summer -> 29
Baron -> 29
Milo -> 29
Kayley -> 29


- Misha