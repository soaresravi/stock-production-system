package com.stock.repository;

import com.stock.model.Product;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped

public class ProductRepository implements PanacheRepository<Product> { //provides ready to use methods
    //listAll (get all products), findById (get one product by id), persist (save new product), deleteById
}
