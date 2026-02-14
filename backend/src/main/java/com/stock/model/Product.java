package com.stock.model;

import jakarta.persistence.*;

@Entity //table in db
@Table(name = "product") //name (optional, default is the class name) 

public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //auto increment
    private Long id;

    @Column(unique = true, nullable = false)
    private String code;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Double price;

    public Product() {} //builders

    public Product(String code, String name, Double price) {
        this.code = code;
        this.name = name;
        this.price = price;
    }

    public Long getId() { return id; } //getters and setters
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
}
