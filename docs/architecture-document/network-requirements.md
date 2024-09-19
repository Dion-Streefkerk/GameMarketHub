# Technical infrastructure requirements
(Use this to demonstrate criterion k3.)

## Delivery
During the development of new games in our competition earlier this year, we struggled a lot with product presentations. Often, the games were not deployed at the end of the sprint, parts indicated as done were not functioning yet, or a fatal bug had emerged at the last moment in the code. Bert Rongil was seen swearing and ranting in the hallway after every product review. His wife is worried about his blood pressure; he already has a pacemaker, so let's take his health into account.

For each review, deploy your latest production-ready version to the live server. Test thoroughly to ensure it actually works! This can also be done, for example, by using ViTest or a Rest client (such as Postman, ARC, Insomnia). You may use manual FTP deployment or utilize CI/CD. If you use CI/CD, also automate your written tests immediately; it's much easier.

Redirects
In the past, Stan Manstan, a solution architect from Lucastars, enforced singular resource names in the endpoints on our servers. An example of this is:

```typescript
/shopping-cart/item/{id}
```

A new wind has since blown through the development department. We are now all enthusiastic believers in plural resource names:

```typescript
/shopping-cart/items/{id}
```
Unfortunately, some of our applications have not yet been adjusted to this. This means that for a resource, both addresses must be available. So, for each endpoint address you create, there may still be an application expecting it in singular form. Of course, it's nonsense to rewrite all the code. Moreover, it should be clear that these addresses have moved. Therefore, you will redirect these addresses using the HTTP protocol. Fortunately, this can be easily done with Express.js. A learning story has also been created to assist you. Be aware that you must clearly indicate in the redirect whether, for example, the body should also be resent. So, the type of code may be important!

## Designs
Since we still have an above-average number of departing developers (HR is working on it), we also have an above-average influx of young developers. It's impossible to manually explain to all developers how our systems communicate.

Create a sequence diagram for the webshop, specifically for the operation of the HTTP redirect. This way, new team members will immediately understand what is intended. Furthermore, it's nice to have a network diagram of our servers and their communication to the client. This may become important. With the resounding success of the game competition, we may need to switch to professional hosting; the server in my shed often emits clouds of smoke.