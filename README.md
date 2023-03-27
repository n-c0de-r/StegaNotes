# StegaNotes

## Table of Contents

- [StegaNotes](#steganotes)
  * [Project Description](#project-description)
  * [Motivation](#motivation)
  * [Problem Solved](#problem-solved)
  * [Lessons Learned](#lessons-learned)
  * [Unique Features](#unique-features)
  * [Future Implementations](#future-implementations)
  * [Planned Improvements](#planned-improvements)
  * [Installation and Usage](#installation-and-usage)
  * [Contributing](#contributing)
  * [Credits](#credits)
  * [License](#license)

## Project Description
StegaNotes is a Progressive Web App that allows users to take notes and encode them with steganography techniques, using a minimalist approach without the usual overhead of tech stacks and frameworks. The app is built with pure HTML, CSS, JavaScript, and IndexedDB.

## Motivation
The main motivation for building StegaNotes was to learn more about PWA programming and deployment, and to gain a deeper understanding of IndexedDBs. Additionally, the app was inspired by an interest in cryptography and steganography, and a desire to create a simple note-taking app with a unique twist.

## Problem Solved
StegaNotes solves the problem of needing a quick and easy way to encrypt short notes without relying on third-party servers or complicated cryptographic keys. The app allows users to encode and decode their messages within the app itself, and provides a fun and engaging user experience.

## Lessons Learned
Throughout the development of StegaNotes, I gained a deep understanding of PWA programming, IndexedDBs, CSS layout, and component thinking. I also learned how to work with SVGs and convert them to PNGs within the browser. This project made me appreciate the benefits of frameworks that take care of such things, while also showing the power of a minimalist approach.

## Unique Features
StegaNotes stands out for its minimalist design, multiplatform usability, and ability to share encoded messages via Web API natively. It is easy to use and extensible, providing a fun and unique note-taking experience for users.

## Future Implementations
In the future, I plan to implement the ability to read and convert TEI files from https://freedict.org/ and convert them to custom JSON files for storing words in the IndexedDB. Additionally, I plan to add the ability to switch dictionaries and languages, and to provide customizable style themes for the app. Finally, refactoring the code to be truly component based and extensible, and introduce a serverless way of resetting lost passwords.

## Installation and Usage
StegaNotes is a PWA that can be easily installed and used by visiting the project's [GitHub Page](n-c0de-r.github.io/StegaNotes).

![GIF of the StegaNotes App in action](./StegaNotes_show.gif)

## Contributing
Anyone is welcome to fork and contribute to the app. The code is well-documented and easy to understand.

## Credits

- The [Stack Overflow community](https://crypto.stackexchange.com/a/62776) for providing the general idea behind StegaNotes and steganography techniques
- https://freedict.org/ for providing the English dictionary file used as a template wordset
- The [Standing Baby Dinosaurs SVG Bundle](https://www.etsy.com/de-en/listing/1100497380/standing-baby-dinosaurs-svg-bundle-dxf) for providing the basis for StegaNotes' dinosaur icon
- OpenDyslexic for providing the fonts used in the app.

## License
StegaNotes is licensed under the MIT License.