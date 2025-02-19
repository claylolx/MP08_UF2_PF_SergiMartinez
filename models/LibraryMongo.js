const { MongoClient, ObjectId } = require("mongodb");

class Library {
    constructor() {
        this.mongoUrl = "mongodb://localhost:27017"; // URL de conexión
        this.dbName = "library"; // Nombre de la base de datos
        this.client = new MongoClient(this.mongoUrl);
        this.database = null;
    }

    async connect() {
        if (!this.database) {
            await this.client.connect();
            this.database = this.client.db(this.dbName); // Conectar a la base de datos
            console.log(`Conectado a la base de datos: ${this.dbName}`);
        }
    }

    async close() {
        await this.client.close();
        this.database = null;
        console.log("Conexión cerrada");
    }

    // async listAll() {
    //     await this.connect();
    //     return await this.database.collection("books").find({}).toArray();
    // }

    listAll = async () => {
      await this.connect();
      const books = await this.database.collection("books").find({}).toArray();
      return books.map(book => ({
          id: book._id, // Usa `_id` como `id`
          title: book.title,
          author: book.author,
          year: book.year,
      }));
  };
  

    async create(newBook) {
        await this.connect();
        const result = await this.database.collection("books").insertOne(newBook);
        return result.insertedId;
    }

    async update(updatedBook) {
        await this.connect();
        const result = await this.database.collection("books").updateOne(
            { _id: new ObjectId(updatedBook.id) },
            { $set: { title: updatedBook.title, author: updatedBook.author, year: updatedBook.year } }
        );
        return result.modifiedCount > 0;
    }

    async delete(id) {
        await this.connect();
        const result = await this.database.collection("books").deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount > 0;
    }
}

module.exports = Library;
