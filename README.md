# The Plaintext OT Type

This OT type can be used to edit plaintext documents, like sourcecode or
markdown.

This project's [history is here](https://github.com/share/ShareJS/blob/0.6/src/types/text2.coffee).

For documentation on the spec this type implements, see [ottypes/docs](/ottypes/docs).

## Spec

The plaintext OT type thinks of the document as a giant string, and edits index
into the string directly. This is different from most text editors, which break
up a document into an array of lines. For small documents on modern computers,
the conversion isn't particularly expensive. However, if you have giant
documents you should be using a rope library like
[jumprope](https://github.com/josephg/jumprope) or
[librope](https://github.com/josephg/librope).

Each operation describes a traversal over the document. The traveral can edit
the document as it goes.

For example, given the document:

```
"ABCDEFG"
```

You could apply the operation

```
[1, ' hi ', 2, {d:3}]
```

This operation will skip the first character, insert ' hi ', skip 2 more
characters then delete the next 3 characters. The result would be:

```
"A hi BCG"
```

### Operations

Operations are lists of components, which move along the document. Each
component is one of

- **Number N**: Skip forward *N* characters in the document
- **"str"**: Insert *"str"* at the current position in the document
- **{d:N}**: Delete *N* characters at the current position in the document

The operation does not have to skip the last characters in the document.

### Selections

The text type also has methods for manipulating selections.

Selection ranges are either a single number (the cursor position) or a pair of
[anchor, focus] numbers (aka [start, end]) of the selection range. Be aware
that end can be before start.

---

# Commentary

This is the 3rd iteration of ShareJS's plaintext type. It hasn't been changed
in a long time now.

The first iteration was similar, except it is invertable. Invertability is
nice, but I want to eventually build an arbitrary P2P OT system, and in a p2p
setting invertibillity becomes impractical to achieve. I don't want systems to
depend on it.

The second iteration made each component specify a location and an edit there.
Operations were lists of these edits. Because the components were not sorted,
if you transform two big operations by one another it requires M\*N
time to transform. The components could be sorted to fix this, but if you're
going to do that you may as well just make them sorted by design - which is
what the current text implementation does. I thought the individual edits style
was better because I expected it to be simpler, but when I implemented it I
found the implementation of each method was almost identical in size.

There is also a [C implementation of this type](https://github.com/share/libot/blob/master/text.h) which is
[insanely](https://dl.dropboxusercontent.com/u/2494815/ot%20apply%20bench%201.png)
[fast](https://dl.dropboxusercontent.com/u/2494815/ot%20apply%20bench%202.png).
The implementations are almost the same, except javascript counts characters
using 16 bit words and the C implementation counts characters using UTF8
codepoints. This means that if you have any characters in the astral plane in
your document, edit & cursor positions won't be aligned. See [here for more
information](http://josephg.com/blog/string-length-lies).

---

# License

All code contributed to this repository is licensed under the standard MIT license:

Copyright 2011 ottypes library contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following condition:

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.



