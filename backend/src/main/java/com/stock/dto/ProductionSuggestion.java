package com.stock.dto;

public class ProductionSuggestion {
    
    private Long productId;
    private String productName;
    private Double productPrice;
    private Integer quantity;
    private Double totalValue;

    public ProductionSuggestion() {}

    public ProductionSuggestion(Long productId, String productName, Double productPrice, Integer quantity) {
        this.productId = productId;
        this.productName = productName;
        this.productPrice = productPrice;
        this.quantity = quantity;
        this.totalValue = productPrice * quantity;
    }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public Double getProductPrice() { return productPrice; }
    public void setProductPrice(Double productPrice) { this.productPrice = productPrice; }

    public Integer getQuantity() { return quantity; }
   
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
        this.totalValue = this.productPrice * quantity;
    }

    public Double getTotalValue() { return totalValue; }
    public void setTotalValue(Double totalValue) { this.totalValue = totalValue; }
}
