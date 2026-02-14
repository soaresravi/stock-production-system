package com.stock.repository;

import com.stock.model.ProductRawMaterial;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;

@ApplicationScoped

public class ProductRawMaterialRepository implements PanacheRepository<ProductRawMaterial> {
    
    public List<ProductRawMaterial> findByProductId(Long productId) { //find all associations for a specific product
        return list("product.id", productId); //product.id refers to the product fields id property
    }

    public List<ProductRawMaterial> findByRawMaterialId(Long rawMaterialId) {
        return list("rawMaterial.id", rawMaterialId);
    }
}
