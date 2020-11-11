# typebits

Example typescript snippets looking into various aspects of Typescript/Javascript.

## async operations using forEach, for..of, and map

Today I wrote a program that processed a list of files. Although I used streaming to process the files, I wanted the file processing to flow sequentially. I struggled for about an hour today trying to use forEach combined with async/await. I knew what was happening but
I didn't know at first how to reorganize my code.
