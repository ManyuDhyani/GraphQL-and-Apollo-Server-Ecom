const { ApolloServer, gql } = require("apollo-server")
const { v4: uuid } = require("uuid")

const products = [
    {
        id: "1",
        name: "Product 1",
        description: "Product 1 description",
        quantity: 100,
        price: 342.44,
        image: "img-1",
        onSale: false,
        categoryId: "1"
    },
    {
        id: "2",
        name: "Product 2",
        description: "Product 2 description",
        quantity: 200,
        price: 642.44,
        image: "img-1",
        onSale: false,
        categoryId: "2"
    },
    {
        id: "3",
        name: "Product 3",
        description: "Product 3 description",
        quantity: 300,
        price: 242.44,
        image: "img-1",
        onSale: false,
        categoryId: "1"
    },
    {
        id: "4",
        name: "Product 4",
        description: "Product 4 description",
        quantity: 400,
        price: 942.44,
        image: "img-1",
        onSale: true,
        categoryId: "4"
    },
    {
        id: "5",
        name: "Product 5",
        description: "Product 5 description",
        quantity: 500,
        price: 1942.44,
        image: "img-5",
        onSale: true,
        categoryId: "3"
    }
]

const categories = [
    {
        id: "1",
        name: "Kitchen"
    },
    {
        id: "2",
        name: "Garden"
    },
    {
        id: "3",
        name: "Sports"
    },
    {
        id: "4",
        name: "Bathroom"
    }
]

const typeDefs = gql`
    type Query {
        products: [Product!]!
        product(id: ID!): Product
        categories: [Category!]!
        category(id: ID!): Category
    }

    type Mutation {
        addCategory(input: AddCategoryInput!): Category!
        addProduct(input: AddProductInput!): Product!
        deleteCategory(id: ID!): Category
    }

    type Product {
        id: ID!
        name: String!
        description: String!
        quantity: Int!
        price: Float!
        onSale: Boolean!
        image: String!
        category: Category
    }

    type Category {
        id: ID!
        name: String!
        products: [Product!]!
    }

    input AddCategoryInput {
        name: String!
    }

    input AddProductInput {
        name: String!
        description: String!
        quantity: Int!
        price: Float!
        onSale: Boolean!
        image: String!
        categoryId: String!
    }

`;

const resolvers = {
    Query: {
        products: () => products,
        product: (parent, args, context) => {
            const {id} = args;
            return products.find(product => product.id === id);
        },
        categories: () => categories,
        category: (_, args) => {
            const { id } = args;
            return categories.find((category)=> category.id === id)
        },
    },

    Category: {
        products: (parent, args) => {
            const categoryId = parent.id;
            return products.filter((product)=>product.categoryId === categoryId)
        }
    },

    Product: {
        category: (parent) => {
            const categoryId = parent.categoryId;
            return categories.find((category)=>category.id === categoryId)
        }
    },

    Mutation : {
        addCategory: (parent, { input }, context) => {
            const { name } = input;
            const newCategory = {
                id: uuid(),
                name
            };
            categories.push(newCategory);
            return newCategory;
        },

        addProduct: (parent, { input }, context) => {
            const { name, image, price, onSale, quantity, description, categoryId } = input
            const newProduct = {
                id: uuid(),
                name,
                image,
                price,
                onSale,
                quantity,
                description,
                categoryId
            }
            products.push(newProduct);
            return newProduct;
        },

        deleteCategory: (parent, { id }, context) => {
            categories = categories.pop((category)=> category.id === id)
            return categories;
        }
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
})



server.listen().then(({url})=>{
    console.log("Server is up at: " + url)
})