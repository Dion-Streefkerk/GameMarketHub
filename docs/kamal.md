# vertical slice

## UserService.ts

```ts
/**
 * Voegt een nieuw product toe aan de database.
 * 
 * @remarks
 * Deze functie volgt de SOLID-principes:
 * - Single Responsibility Principle (SRP): Het heeft slechts één verantwoordelijkheid, namelijk het toevoegen van een product.
 * - Open/Closed Principle (OCP): Het staat open voor uitbreiding maar gesloten voor wijzigingen, waardoor veranderingen in andere delen van het systeem mogelijk zijn zonder deze functie aan te passen.
 * - Liskov Substitution Principle (LSP): Het accepteert verschillende soorten productgegevens via polymorfisme zonder de werking ervan te beïnvloeden.
 * - Interface Segregation Principle (ISP): Het exposeert geen onnodige methoden of eigenschappen, waardoor de interface gericht en specifiek blijft.
 * - Dependency Inversion Principle (DIP): Het is afhankelijk van abstracties zoals `_tokenService` en `fetch` in plaats van concrete implementaties, waardoor flexibiliteit en eenvoudig testen worden bevorderd.
 * 
 * @param productData - De gegevens van het product dat moet worden toegevoegd. 
 * Het kan van het type 'product', 'Game' of 'Merchandise' zijn.
 * 
 * @returns Een Promise die 'true' oplevert als het product succesvol is toegevoegd, 
 * anders 'false'.
 * 
 * @public
 */
public async addProduct(productData: product | Game | Merchandise): Promise<boolean> {
    // Ophalen van authenticatietoken
    const token: string | undefined = this._tokenService.getToken();

    // Controleren of het token beschikbaar is
    if (!token) {
        return false;
    }

    // Verstuur een POST-verzoek om het product toe te voegen
    const response: Response = await fetch(`${viteConfiguration.API_URL}addProduct`, {
        method: "post",
        headers: { "Content-Type": "application/json", authorization: token },
        body: JSON.stringify(productData),
    });

    // Behandeling van de respons
    if (!response.ok) {
        console.error(response);
        return false;
    }

    // Product succesvol toegevoegd
    return true;
}
```

## UserController.ts

```ts

class ProductAdder {
    private productProcessor: ProductProcessor;
    private databaseHandler: DatabaseHandler;

    constructor(productProcessor: ProductProcessor, databaseHandler: DatabaseHandler) {
        this.productProcessor = productProcessor;
        this.databaseHandler = databaseHandler;
    }

/**
 * Voegt een nieuw product toe aan de database.
 * 
 * Single Responsibility Principle (SRP):
 * De ProductAdder klasse heeft de verantwoordelijkheid om een nieuw product toe te voegen aan de database.
 * 
 * Open/Closed Principle (OCP):
 * De ProductAdder klasse is open voor uitbreiding omdat nieuwe producttypen kunnen worden toegevoegd zonder de bestaande code te wijzigen.
 * Dit wordt mogelijk gemaakt door de ProductProcessor klasse die nieuwe producttypen kan verwerken zonder de ProductAdder klasse te wijzigen.
 * 
 * Dependency Inversion Principle (DIP):
 * De ProductAdder klasse is niet afhankelijk van specifieke implementaties van ProductProcessor en DatabaseHandler,
 * maar vertrouwt op abstracties (interfaces of basisklassen). Dit maakt het mogelijk om verschillende implementaties van deze afhankelijkheden in te voegen
 * zonder de ProductAdder klasse te wijzigen, wat flexibiliteit en uitbreidbaarheid biedt.
 * 
 * @param req - Het verzoekobject van de client.
 * @param res - Het antwoordobject naar de client.
 * @returns Een belofte die wordt opgelost wanneer het product succesvol is toegevoegd.
 */
    public async addProduct(req: Request, res: Response): Promise<void> {
        const productType: string = req.body.productType;

        try {
            const productData = this.productProcessor.parseProductData(req.body, productType);
            const connection = await this.databaseHandler.beginTransaction();
            const productId = await this.databaseHandler.insertProduct(connection, productData);
            await this.databaseHandler.insertSubtypeData(connection, productType, productData, productId);
            await this.databaseHandler.commitTransaction(connection);
            res.status(200).json({ message: "Product added successfully." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Failed to add product." });
        }
    }
}

/**
 * Analyseert de gegeven productgegevens en retourneert het bijbehorende producttype.
 * 
 * Liskov Substitution Principle (LSP):
 * De ProductProcessor klasse accepteert een abstract producttype (Product), maar kan worden geconfigureerd om specifieke subtypen zoals Game en Merchandise te verwerken.
 * Dit betekent dat objecten van subtypen naadloos kunnen worden vervangen door objecten van hun supertype.
 * 
 * @param data - De productgegevens die moeten worden geanalyseerd.
 * @param productType - Het type product om te analyseren.
 * @returns Het bijbehorende producttype.
 * @throws {Error} - Een fout wordt gegenereerd als het producttype ongeldig is.
 */
class ProductProcessor {
    public parseProductData(data: any, productType: string): Product | Game | Merchandise {
        if (productType === "game") {
            return data as Game;
        } else if (productType === "merchandise") {
            return data as Merchandise;
        } else {
            throw new Error("Invalid product type.");
        }
    }
}
/**
 * Start een transactie in de database.
 * 
 * Single Responsibility Principle (SRP):
 * De DatabaseHandler klasse heeft de verantwoordelijkheid om databasegerelateerde bewerkingen uit te voeren, zoals transacties starten, gegevens invoegen en transacties beëindigen.
 * 
 * @returns Een belofte die wordt opgelost met een databaseverbinding.
 */
class DatabaseHandler {
    public async beginTransaction(): Promise<PoolConnection> {
        const connection = await getConnection();
        await connection.beginTransaction();
        return connection;
    }

    public async insertProduct(connection: PoolConnection, productData: Product | Game | Merchandise): Promise<number> {
        const query = "INSERT INTO Product (name, price, inventory_quantity, average_rating, category, description, image_urls) VALUES (?, ?, ?, ?, ?, ?, ?)";
        const result = await queryDatabase(
            connection,
            query,
            productData.name,
            productData.price,
            productData.inventory_quantity,
            productData.average_rating,
            productData.category,
            productData.description,
            productData.image_urls.join(',')
        );
        if (result.affectedRows !== 1) {
            throw new Error("Failed to add product.");
        }
        return result.insertId;
    }

    public async insertSubtypeData(connection: PoolConnection, productType: string, productData: Product | Game | Merchandise, productId: number): Promise<void> {
        if (productType === "game") {
            await this.insertGameData(connection, productData as Game, productId);
        } else if (productType === "merchandise") {
            await this.insertMerchandiseData(connection, productData as Merchandise, productId);
        }
    }

    private async insertGameData(connection: PoolConnection, gameData: Game, productId: number): Promise<void> {
        const query = "INSERT INTO Game (product_id, platform, release_date) VALUES (?, ?, ?)";
        const result = await queryDatabase(connection, query, productId, gameData.platform, gameData.release_date);
        if (result.affectedRows !== 1) {
            throw new Error("Failed to add game data.");
        }
    }

    private async insertMerchandiseData(connection: PoolConnection, merchandiseData: Merchandise, productId: number): Promise<void> {
        const query = "INSERT INTO Merchandise (product_id, size, color) VALUES (?, ?, ?)";
        const result = await queryDatabase(connection, query, productId, merchandiseData.size, merchandiseData.color);
        if (result.affectedRows !== 1) {
            throw new Error("Failed to add merchandise data.");
        }
        if (merchandiseData.game_id !== null) {
            await this.linkMerchandiseToGame(connection, merchandiseData.game_id, productId);
        }
    }

    private async linkMerchandiseToGame(connection: PoolConnection, gameId: number, merchandiseId: number): Promise<void> {
        const query = `
            INSERT INTO game_merchandise (merchandise_id, game_id)
            SELECT ?, ?
            FROM product p
            LEFT JOIN merchandise m ON p.product_id = m.product_id
            WHERE p.product_id = ?
        `;
        await queryDatabase(connection, query, gameId, merchandiseId, merchandiseId);
    }

    public async commitTransaction(connection: PoolConnection): Promise<void> {
        await connection.commit();
        connection.release();
    }
}

export default ProductAdder;
```

## Routs.ts

```ts
router.post("/addProduct", (req, res): any => userController.addProduct(req, res));

```

## AccountPage.ts

```ts
/**
 * Interface voor productgegevens.
 * Dit definieert de attributen die een product kan hebben.
 * Deze interface wordt gebruikt als basis voor andere productinterfaces.
 */
interface ProductData {
    name: string;
    price: number;
    inventory_quantity: number;
    average_rating: number;
    category: string;
    description: string;
    image: string[];
}

/**
 * Interface voor spelproductgegevens.
 * Breidt ProductData uit met specifieke attributen voor spelproducten.
 */
interface GameProductData extends ProductData {
    game_id: number;
    platform: string;
    release_date: string;
}

/**
 * Interface voor merchandise productgegevens.
 * Breidt ProductData uit met specifieke attributen voor merchandise-producten.
 */
interface MerchandiseProductData extends ProductData {
    size: string;
    color: string;
}

/**
 * Render Add Product Form.
 * Functie verantwoordelijk voor het weergeven van het formulier om een nieuw product toe te voegen.
 */
private renderAddProductForm(): TemplateResult {
    return html`
        <div class="add-product-form">
            <h2>Add Product</h2>
            <div>
                <label for="product-type">Product Type</label>
                <select id="product-type" @change=${this.handleProductTypeChange}>
                    <option value="Choose the Type"></option>
                    <option value="game">Game</option>
                    <option value="merchandise">Merchandise</option>
                </select>
            </div>
            <div>
                <label for="game_id">Game ID, ONLY TO CONNECT MERCH TO AN GAME_ID</label>
                <input type="number" id="game_id" />
                <div>
                    <label for="product-name">Name</label>
                    <input type="text" id="product-name" />
                </div>
                <div>
                    <label for="product-price">Price</label>
                    <input type="number" id="product-price" />
                </div>
                <div>
                    <label for="product-quantity">Inventory Quantity</label>
                    <input type="number" id="product-quantity" />
                </div>
                <div>
                    <label for="product-rating">Average Rating</label>
                    <input type="number" id="product-rating" step="0.1" />
                </div>
                <div>
                    <label for="product-category">Category</label>
                    <select id="product-category">
                        <option value="Game">Game</option>
                        <option value="Merchandise">Merchandise</option>
                    </select>
                </div>
                <div>
                    <label for="product-description">Description</label>
                    <textarea id="product-description"></textarea>
                </div>
                <div>
                    <label for="product-images">Image URLs (comma-separated)</label>
                    <input type="text" id="product-images" />
                </div>
                <div id="specific-fields"></div>
                <button @click=${this.submitProduct}>Add Product</button>
            </div>
        </div>
    `;
}

/**
 * Handle Product Type Change.
 * Functie die wordt aangeroepen wanneer het geselecteerde producttype wordt gewijzigd.
 * Dit zorgt voor het dynamisch weergeven van relevante velden op basis van het geselecteerde producttype.
 */
private handleProductTypeChange(event: Event): void {
    const productType: string = (event.target as HTMLSelectElement).value;
    const specificFieldsContainer: HTMLElement | null | undefined =
        this.shadowRoot?.getElementById("specific-fields");
    if (specificFieldsContainer) {
        specificFieldsContainer.innerHTML = "";
        if (productType === "game") {
            specificFieldsContainer.innerHTML = `
      <div>
        <label for="game-platform">Platform</label>
        <input type="text" id="game-platform" />
      </div>
      <div>
        <label for="game-release-date">Release Date</label>
        <input type="date" id="game-release-date" />
      </div>
    `;
        } else if (productType === "merchandise") {
            specificFieldsContainer.innerHTML = `
      <div>
        <label for="merch-size">Size</label>
        <input type="text" id="merch-size" />
      </div>
      <div>
        <label for="merch-color">Color</label>
        <input type="text" id="merch-color" />
      </div>
    `;
        }
    }
}

/**
 * Extract Form Data.
 * Functie verantwoordelijk voor het extraheren van gegevens uit het productformulier.
 * Retourneert een object van het juiste subtype (ProductData, GameProductData, of MerchandiseProductData) op basis van het geselecteerde producttype.
 */
private async submitProduct(): Promise<void> {
    const formData = this.extractFormData();
    if (!this.validateFormData(formData)) {
        return;
    }

    try {
        const result: any = await this._userService.addProduct(formData);
        if (result) {
            alert("Product added successfully!");
        } else {
            alert("Failed to add product. Please try again.");
        }
    } catch (error) {
        console.error("Error adding product:", error);
        alert("An error occurred while adding the product. Please try again.");
    }
}

/**
 * Validate Form Data.
 * Functie verantwoordelijk voor het valideren van de gegevens ingediend via het productformulier.
 * Controleert op geldigheid van de ingevoerde gegevens en geeft indien nodig foutmeldingen weer.
 */
private extractFormData(): ProductData | GameProductData | MerchandiseProductData {
    const productType: string = (this.shadowRoot?.getElementById("product-type") as HTMLSelectElement).value;
    const formData: ProductData = {
        name: (this.shadowRoot?.getElementById("product-name") as HTMLInputElement).value,
        price: parseFloat((this.shadowRoot?.getElementById("product-price") as HTMLInputElement).value),
        inventory_quantity: parseInt((this.shadowRoot?.getElementById("product-quantity") as HTMLInputElement).value, 10),
        average_rating: parseFloat((this.shadowRoot?.getElementById("product-rating") as HTMLInputElement).value),
        category: (this.shadowRoot?.getElementById("product-category") as HTMLSelectElement).value,
        description: (this.shadowRoot?.getElementById("product-description") as HTMLTextAreaElement).value,
        image: (this.shadowRoot?.getElementById("product-images") as HTMLInputElement).value.split(",")
    };

    if (productType === "game") {
        const gameData: GameProductData = formData;
        gameData.game_id = parseInt((this.shadowRoot?.getElementById("game_id") as HTMLInputElement).value);
        gameData.platform = (this.shadowRoot?.getElementById("game-platform") as HTMLInputElement).value;
        gameData.release_date = (this.shadowRoot?.getElementById("game-release-date") as HTMLInputElement).value;
        return gameData;
    } else if (productType === "merchandise") {
        const merchandiseData: MerchandiseProductData = formData;
        merchandiseData.size = (this.shadowRoot?.getElementById("merch-size") as HTMLInputElement).value;
        merchandiseData.color = (this.shadowRoot?.getElementById("merch-color") as HTMLInputElement).value;
        return merchandiseData;
    }

    return formData;
}

/**
 * Submit Product.
 * Functie verantwoordelijk voor het indienen van het productformulier.
 * Verzamelt en valideert eerst de formuliergegevens en stuurt vervolgens een verzoek om het product toe te voegen.
 */
private validateFormData(formData: ProductData): boolean {
    if (formData.average_rating < 0 || formData.average_rating > 5) {
        alert("Average rating must be between 0 and 5.");
        return false;
    }

    // Validate empty fields
    for (const key in formData) {
        if (!formData[key]) {
            alert(`Please fill in ${key.replace(/_/g, ' ')}.`);
            return false;
        }
    }

    return true;
}

    ```