# Probability 1

A first university course in probability, from
[Canon Learning](https://github.com/canonlearning/canon). One lesson is
written so far.

## Layout

- `course.yaml` lists the lessons, the practice problems for each lesson, and
  the quizzes.
- `lessons/` has one Markdown file per lesson. The first line is the title.
- `problems/` has one Markdown file per problem, with its worked solution.

## Preview

For now the engine is expected in a sibling folder, `../canon`, with
`npm install` run in it. Once the site is published, the engine becomes an
ordinary dependency and this repository can be cloned on its own. Then, in this folder:

- `npm run dev` serves the course at `http://localhost:4000` and reloads the
  page when a file is saved.
- `npm run build` writes the site to `dist/`.

Problems and the interactive visuals are not shown yet. A visual appears as
an empty box.

## License

Content is CC BY 4.0 and code is MIT. See [LICENSE.md](LICENSE.md).
