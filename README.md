# Probability 1

A first university course in probability, from
[Canon Learning](https://github.com/canonlearning/canon). One lesson is
written so far, with five practice problems and interactive visuals.

## Layout

- `course.yaml` lists the lessons, and for each one its practice problems.
- `lessons/` has one Markdown file per lesson. The first line is the title.
- `problems/` has one Markdown file per problem, with its worked solution.
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

## Quizzes

The course publishes no quizzes. Every problem here is public with its
solution, so a teacher writes a quiz by changing these problems into new
ones.

## License

Content is CC BY 4.0 and code is MIT. See [LICENSE.md](LICENSE.md).
