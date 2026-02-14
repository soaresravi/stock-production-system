package com.stock.resource;

import com.stock.model.RawMaterial;
import com.stock.repository.RawMaterialRepository;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/api/raw-materials")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)

public class RawMaterialResource {
    
    @Inject
    RawMaterialRepository rawMaterialRepository;

    @GET

    public List<RawMaterial> listAll() {
        return rawMaterialRepository.listAll();
    }

    @GET
    @Path("/{id}")

    public Response getById(@PathParam("id") Long id) {

        RawMaterial material = rawMaterialRepository.findById(id);

        if (material == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        return Response.ok(material).build();

    }

    @POST
    @Transactional

    public Response create(RawMaterial material) {
        rawMaterialRepository.persist(material);
        return Response.status(Response.Status.CREATED).entity(material).build();
    }

    @PUT
    @Path("/{id}")
    @Transactional

    public Response update(@PathParam("id") Long id, RawMaterial material) {

        RawMaterial existing = rawMaterialRepository.findById(id);

        if (existing == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        existing.setCode(material.getCode());
        existing.setName(material.getName());
        existing.setStockQuantity(material.getStockQuantity());

        rawMaterialRepository.persist(existing);
        return Response.ok(existing).build();

    }

    @DELETE
    @Path("/{id}")
    @Transactional

    public Response delete(@PathParam("id") Long id) {

        boolean deleted = rawMaterialRepository.deleteById(id);

        if (!deleted) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        return Response.noContent().build();
    
    }
}
