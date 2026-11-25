# Probability 1

A first university course in probability, from
[Canon Learning](https://github.com/canonlearning/canon). One lesson is
written so far, with five practice problems and interactive visuals.

## Layout

- `course.yaml` lists the lessons, and for each one a one-sentence summary
  for the home page, its practice problems, and its lecture decks.
- `lessons/` has one Markdown file per lesson. The first line is the title.
- `problems/` has one Markdown file per problem, with its worked solution.
- `lectures/` has one Markdown file per lesson: a slide deck for teaching
  it. A line of `---` starts a new slide, and a callout labeled
  `**Notes**` is for the teacher.
- `visuals/` has one TypeScript file per interactive visual. A lesson places
  `visuals/crowd.ts` with the line `::visual{name="crowd"}`.

## Preview

For now the engine is expected in a sibling folder, `../canon`, with
`npm install` run in it. Once the site is published, the engine becomes an
ordinary dependency and this repository can be cloned on its own. Then, in this folder:

- `npm run dev` serves the course at `http://localhost:4000` and reloads the
  page when a file is saved.
- `npm run build` writes the site to `dist/`.

Each lesson ends with its practice problems, each with a worked solution.

## Lecture slides

Under its title, a lesson page links to its slides and to the Markdown files
of the slides and of the page.
A deck is one HTML file,
`dist/lectures/<name>.html`, that works with no network, so it can be copied
to another computer. The arrow keys move between slides, and on a slide
with a drawing they move the drawing one step at a time. A list appears one
point per press, and a calculation one line per press. N shows the notes,
and F fills the screen. Printing it gives one slide to a page with its notes.

To teach from different slides, fork this repository and edit the deck's
Markdown file in `lectures/`, or copy it to a new file and list the copy in
`course.yaml`. `npm run build` writes the new deck.

## Quizzes

The course publishes no quizzes. Every problem here is public with its
solution, so a teacher writes a quiz by changing these problems into new
ones.

## License

Content is CC BY 4.0 and code is MIT. See [LICENSE.md](LICENSE.md).
