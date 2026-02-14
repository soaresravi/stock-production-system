package com.stock.resource;

import com.stock.model.Product;
import com.stock.repository.ProductRepository;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/api/products") //base url for all endpoints
@Produces(MediaType.APPLICATION_JSON) //responses in json format
@Consumes(MediaType.APPLICATION_JSON)

public class ProductResource {
    
    @Inject //quarkus provide an instance of ProductRepository
    ProductRepository productRepository;

    @GET

    public List<Product> listAll() { // http://localhost:8080/api/products and return json array with all products
        return productRepository.listAll();
    }

    @GET
    @Path("/{id}") //url with parameter: /api/products/1, /api/products/2...

    public Response getById(@PathParam("id") Long id) { //path extracts the value from urk and converts to long

        Product product = productRepository.findById(id);

        if (product == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        return Response.ok(product).build();

    }

    @POST
    @Transactional //create (transactional means this operation ll modify db)

    public Response create(Product product) { //json converted to java object
        productRepository.persist(product); //save to db
        return Response.status(Response.Status.CREATED).entity(product).build(); //created + the saved product (with generated id)
    }

    @PUT
    @Path("/{id}")
    @Transactional 

    public Response update(@PathParam("id") Long id, Product product) { 
        
        Product existing = productRepository.findById(id);

        if (existing == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        existing.setCode(product.getCode()); //update with new values from request
        existing.setName(product.getName());
        existing.setPrice(product.getPrice());

        productRepository.persist(existing); //save changes
        return Response.ok(existing).build(); //return updated product

    }

    @DELETE
    @Path("/{id}")
    @Transactional

    public Response delete(@PathParam("id") Long id) {

        boolean deleted = productRepository.deleteById(id); //true if deleted, false if not found

        if (!deleted) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        return Response.noContent().build(); //successful deletion
    }

}
