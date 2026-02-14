package com.stock.repository;

import com.stock.model.RawMaterial;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped

public class RawMaterialRepository implements PanacheRepository<RawMaterial> {
    
}
