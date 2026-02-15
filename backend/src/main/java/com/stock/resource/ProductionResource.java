package com.stock.resource;

import com.stock.model.RawMaterial;
import com.stock.model.Product;
import com.stock.model.ProductRawMaterial;
import com.stock.repository.ProductRawMaterialRepository;
import com.stock.repository.ProductRepository;
import com.stock.repository.RawMaterialRepository;
import com.stock.dto.ProductionSuggestion;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import java.util.*;
import java.util.stream.Collectors;

@Path("/api/production")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)

public class ProductionResource {
    
    @Inject
    ProductRepository productRepository;

    @Inject
    RawMaterialRepository rawMaterialRepository;

    @Inject
    ProductRawMaterialRepository productRawMaterialRepository;

    @GET
    @Path("/suggestions")

    public List<ProductionSuggestion> getSuggestions() {

        List<Product> allProducts = productRepository.listAll(); // get all products and sort by price (desc)
        allProducts.sort((p1, p2) -> p2.getPrice().compareTo(p1.getPrice()));

        Map<Long, Integer> avaliableStock = rawMaterialRepository.listAll().stream().collect(Collectors.toMap(RawMaterial::getId,
        RawMaterial::getStockQuantity)); //create a temporary map of current stock

        Map<Long, List<ProductRawMaterial>> productMaterials = new HashMap<>(); //map to store product associations to avoid multiple db hits

        for (Product product : allProducts) {
            List<ProductRawMaterial> materials = productRawMaterialRepository.findByProductId(product.getId());
            productMaterials.put(product.getId(), materials);
        }

        List<ProductionSuggestion> suggestions = new ArrayList<>();

        for (Product product : allProducts) { //calculate production for each product (prioritizing by price)

            List<ProductRawMaterial> materials = productMaterials.get(product.getId());

            if (materials == null || materials.isEmpty()) {
                continue;
            }

            int maxPossible = Integer.MAX_VALUE;

            for (ProductRawMaterial prm : materials) { //calculate max possible units based on avaliable stock

                Long materialId = prm.getRawMaterial().getId();
                int avaliable = avaliableStock.getOrDefault(materialId, 0);
                int needed = prm.getQuantityNeeded();

                if (needed > 0) {
                    maxPossible = Math.min(maxPossible, avaliable / needed);
                }
            }

            if (maxPossible > 0 && maxPossible < Integer.MAX_VALUE) { //if production if feasible add to list and update stock

                suggestions.add(new ProductionSuggestion(
                    product.getId(),
                    product.getName(),
                    product.getPrice(),
                    maxPossible
                ));

                for (ProductRawMaterial prm : materials) { //deduct the used materials from the stock map for calculations
                    Long materialId = prm.getRawMaterial().getId();
                    int used = prm.getQuantityNeeded() * maxPossible;
                    avaliableStock.put(materialId, avaliableStock.get(materialId) - used);
                }
            }
        }

        return suggestions;
    }
}
