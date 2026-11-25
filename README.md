# Probability 1

A first university course in probability, from
[Canon Learning](https://github.com/canonlearning/canon). One lesson is
written so far, with two interactive visuals.

## Layout

- `course.yaml` lists the lessons, and for each one its practice problems and
  the problems on its practice quiz.
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

Each lesson ends with its practice problems and a link to its practice quiz,
which is a page to print, with the answer key on its own sheet.

## Graded quizzes

The practice quizzes are published with their answer keys, so they are not
for grading. A graded quiz goes in a `private/` folder, which git ignores, so
it is never published:

- `private/problems/` holds the teacher's own problems, in the same format as
  `problems/`. The quickest way to write one is to copy a public problem and
  change it.
- `private/quizzes.yaml` lists the quizzes:

  ```yaml
  quizzes:
    - id: quiz-1
      title: Quiz 1
      problems:
        - my-own-problem
  ```

`npm run dev` shows private quizzes on the home page, ready to print.
`npm run build` leaves them out.

## License

Content is CC BY 4.0 and code is MIT. See [LICENSE.md](LICENSE.md).
