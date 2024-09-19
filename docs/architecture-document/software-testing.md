# Software testing
(Use this to demonstrate criterion k1.)

Testing is very important in software development! In fact, bugs almost always arise when writing software. Testing verifies the functionality and quality of the code. Errors and bugs can thus be found and, of course, resolved. Testing ensures reliability and consistency in the software, reducing the risk of malfunctions and errors. By performing tests, developers can be sure that the software meets the requirements and expectations of the end-users and/or the client.

We test software for quality control, to detect potential bugs.

### Overview of types of testing

| Type             | What is tested?                                              | Why?                                                                              | Who?      |
| ---------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------- | --------- |
| Unit test        | Functionality of 1 component (unit) in the code.             | Testing if that one component functions.                                          | Developer |
| Integration test | Functionality and performance of multiple code components.   | Testing that different components of the software work together.                   | Developer |
| End-to-End test  | Software system interactions (backend to frontend events).   | Testing if the entire system works.                                                | Developer |
| Regression test  | A scenario in which a bug surfaced in the software.          | Testing if a bug has been "fixed."                                                 | Developer |
| Acceptance test  | The entire software suite.                                  | The client can test and confirm that the software works as it should.             | End-user  |


### Test frameworks

Examples of unit test frameworks: [Jest](https://jestjs.io/), [Jasmine](https://jasmine.github.io/), [Vitest](https://vitest.dev/).

For Integration or End-to-End (E2E) testing, you can use these frameworks, for example: [Cypress](https://www.cypress.io/), [Selenium](https://www.selenium.dev/), [Katalon](https://katalon.com/).

## Test Driven Development

Test Driven Development (TDD) is a development method where tests are written before implementing functionality. The process begins with writing a test that describes the desired functionality. Then, the minimum amount of code to pass this test is written. After implementation, the code is continuously improved to pass new tests, creating an iterative development cycle. TDD helps in producing clean, well-structured code and reduces the chance of bugs. It might be interesting to try out this way of programming: some developers dislike it, while others can't live without it (anymore)....

### Sources

[Building Maintainable Software p. 111 (2016)](https://learning-oreilly-com.rps.hva.nl/library/view/building-maintainable-software/9781491967423/ch10.html#TableTestTypes)

[Top 10 integration test tools](https://katalon.com/resources-center/blog/integration-testing-tools)

[E2E test frameworks](https://katalon.com/resources-center/blog/integration-testing-tools)

