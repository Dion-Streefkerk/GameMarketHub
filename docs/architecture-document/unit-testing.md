# Unit testing
(Use this to demonstrate criterion k1.)

A 'unit' is the smallest testable part of a piece of code. In most programming languages, this is a 'method' or 'function'.

## A Typescript example

Example of a unit test in TypeScript for a web component frontend element:

```typescript
// header.ts
import { LitElement, TemplateResult, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("webshop-header")
export class Header extends LitElement {
    public static styles = css`
        .count {
            color: white;
        }
    `;

    @property() private _count: number = 0;

    private clickButtonHandler(): void {
        this.updateCount();
    }

    public updateCount(): void {
        this._count++;
    }

    public get count(): number {
        return this._count;
    }

    private renderCountExample(): TemplateResult {
        return html`
            <button class="btn" @click="${this.clickButtonHandler}">Increment count</button>
            <div class="count">Count: ${this.count}</div>
        `;
    }

    protected render(): TemplateResult {
        return html` <header>${this.renderCountExample()}</header> `;
    }
}

// header.test.ts
import { expect, it, describe } from "vitest";
import { Header } from "../../web/src";

describe("Header component", () => {
    it("update and get the count value", () => {
        // arrange
        const mockHeader: Header = new Header();
        // act
        mockHeader.updateCount();
        // assert
        expect(mockHeader.count).toEqual(1);
    });
});
```

In the above TypeScript example, you see a Header class that renders a button and a 'counter'. The test file header.test.ts uses the Header class and the public method updateCount to verify the incrementation of this count parameter.

## A Python example

```python
# structure

project/
│
├── code/
│   ├── __initII.py
│   └── my_calculations
│
└── test.py

# project/code/my_calculations.py

class Calculations:
    def __init__(self, a, b):
        self.a = a
        self.b = b

    def get_sum(self):
        return self.a + self.b

    def get_difference(self):
        return self.a - self.b

    def get_product(self):
        return self.a * self.b

    def get_quotient(self):
        return self.a / self.b

# project/test.py

import unittest
from code.my_calculations import Calculations

class TestCalculations(unittest.TestCase):

    def test_sum(self):
        calculation = Calculations(8, 2)
        self.assertEqual(calculation.get_sum(), 10, 'The sum is wrong.')

if __name__ == '__main__':
    unittest.main()

```

## Arrange-Act-Assert Pattern

In the above TypeScript test, you see the comments 'arrange', 'act', and 'assert'. This is a pattern/structure commonly used by many developers to structure their tests. 'Arrange' stands for organizing the prerequisites of your test (which classes and/or data do you need?). 'Act' stands for performing a method or function. 'Assert' stands for the expected outcome.

## Code Coverage

You should always try to *cover* as much of your code with tests as possible. For this purpose, the metric *code coverage* exists. While 100% *code coverage* sounds amazing, in practice it proves to be near impossible. However, you can always achieve 100% *code coverage* on a specific function, or even a whole file. Start small, then grow bigger over time!

## Unit Test tools

The most commonly used test tools are. It is advisable to visit the websites of these different tools to recognize the differences and similarities between them:

-   [Jest](https://jestjs.io/)
-   [Mocha](https://mochajs.org/) and [Chai](https://www.chaijs.com/)
-   [Jasmine](https://jasmine.github.io/)

## Bronnen

[Python unittest library](https://docs.python.org/3/library/unittest.html)

[Python unit test tutorial](https://www.dataquest.io/blog/unit-tests-python/)

[Unit Test tools](https://clouddevs.com/typescript/unit-testing/)

