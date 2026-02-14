package com.stock.resource;

import com.stock.model.Product;
import com.stock.model.RawMaterial;
import com.stock.model.ProductRawMaterial;
import com.stock.repository.ProductRepository;
import com.stock.repository.RawMaterialRepository;
import com.stock.repository.ProductRawMaterialRepository;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import java.util.Map;

@Path("/api/product-raw-materials")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)

public class ProductRawMaterialResource {
    
    @Inject
    ProductRawMaterialRepository repository;

    @Inject
    ProductRepository productRepository;
    
    @Inject
    RawMaterialRepository rawMaterialRepository;

    @GET //get api/product-raw-materials/product/{productId}
    @Path("product/{productId}")

    public List<ProductRawMaterial> getByProduct(@PathParam("productId") Long productId) {
        return repository.findByProductId(productId);
    } // return all raw materials used by a specific product

    @POST
    @Transactional

    public Response associate(Map<String, Object> request) {
        
        //extract values from json request
        Long productId = Long.valueOf(request.get("productId").toString());
        Long rawMaterialId = Long.valueOf(request.get("rawMaterialId").toString());
        Integer quantity = Integer.valueOf(request.get("quantity").toString());

        Product product = productRepository.findById(productId);

        if (product == null) {
            return Response.status(Response.Status.NOT_FOUND).entity("Product not found").build();
        }

        RawMaterial rawMaterial = rawMaterialRepository.findById(rawMaterialId);

        if (rawMaterial == null) {
            return Response.status(Response.Status.NOT_FOUND).entity("Raw material not found").build();
        }

        ProductRawMaterial existing = repository.find("product.id = ?1 and rawMaterial.id = ?2", productId, rawMaterialId).firstResult();

        if (existing != null) {
            return Response.status(Response.Status.CONFLICT).entity("Association already exists").build();
        } //check if this association exists

        ProductRawMaterial prm = new ProductRawMaterial(product, rawMaterial, quantity);
        repository.persist(prm); //create and save the new association

        return Response.status(Response.Status.CREATED).entity(prm).build(); 

    }

    @PUT
    @Path("/{id}")
    @Transactional

    public Response update(@PathParam("id") Long id, Map<String, Object> request) {

        ProductRawMaterial prm = repository.findById(id);

        if (prm == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        Integer quantity = Integer.valueOf(request.get("quantity").toString()); //update quantity
        prm.setQuantityNeeded(quantity);
        repository.persist(prm);

        return Response.ok(prm).build();

    }

    @DELETE
    @Path("/{id}")
    @Transactional

    public Response delete(@PathParam("id") Long id) {
        
        boolean deleted = repository.deleteById(id);

        if (!deleted) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        return Response.noContent().build();
    }
}
