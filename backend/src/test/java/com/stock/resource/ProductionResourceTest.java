package com.stock.resource;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.*;
import static org.hamcrest.Matchers.greaterThan;

import jakarta.transaction.Transactional;
import jakarta.inject.Inject;

import com.stock.repository.ProductRepository;
import com.stock.repository.RawMaterialRepository;
import com.stock.model.Product;
import com.stock.model.ProductRawMaterial;
import com.stock.model.RawMaterial;
import com.stock.repository.ProductRawMaterialRepository;

@QuarkusTest

public class ProductionResourceTest {
    
    @Inject
    ProductRepository productRepository;

    @Inject
    RawMaterialRepository rawMaterialRepository;

    @Inject
    ProductRawMaterialRepository associationRepository;

    @BeforeEach
    @Transactional

    public void cleanup() {
       
        associationRepository.deleteAll();
        productRepository.deleteAll();
        rawMaterialRepository.deleteAll();

        createTestData(); //fresh test data for each test
    }

    private void createTestData() {

        RawMaterial wood = new RawMaterial("TEST_WOOD", "Test Wood", 100);
        rawMaterialRepository.persist(wood); //create raw materials with test stock quantities

        RawMaterial nails = new RawMaterial("TEST_NAILS", "Test Nails", 500);
        rawMaterialRepository.persist(nails);

        RawMaterial paint = new RawMaterial("TEST_PAINT", "Test Paint", 50);
        rawMaterialRepository.persist(paint);

        Product luxury = new Product("TEST_LUXURY", "Test Luxury Chair", 299.90);
        productRepository.persist(luxury); //create test products with different prices to test priorization

        Product another = new Product("TEST_ANOTHER", "Test Another Product", 149.90);
        productRepository.persist(another);

        associationRepository.persist(new ProductRawMaterial(luxury, wood, 8)); //associations linking products to the RM thy need
        associationRepository.persist(new ProductRawMaterial(luxury, nails, 30));
        associationRepository.persist(new ProductRawMaterial(luxury, paint, 2));
        associationRepository.persist(new ProductRawMaterial(another, wood, 2)); //needs 2 woods

        associationRepository.flush(); //ensure all datas written to the db before tests run
    }

    @Test

    public void testGetSuggestions() { //tests the profuctions suggestions endpoint (verifies status, empty, valid values)
        given().when().get("/api/production/suggestions").then().statusCode(200).body("$.size()",
        greaterThan(0)).body("[0].productId", notNullValue()).body("[0].productName", notNullValue()).body("[0].productPrice",
        notNullValue()).body("[0].quantity", greaterThan(0)).body("[0].totalValue", notNullValue());
    }

    @Test

    public void testPrioritization() { //tests that products re prioritized by price

        var response = given().when().get("/api/production/suggestions").then().statusCode(200).extract().jsonPath();
        
        float firstPrice = response.getFloat("[0].productPrice"); //gets the price of the first product
        assert(firstPrice == 299.90f || firstPrice == 299.9f); //accepts both point representation

        if (response.getList("$").size() > 1) { //if theres a second product, verifies its cheaper than the first
            float secondPrice = response.getFloat("[1].productPrice");
            assert(firstPrice > secondPrice);
        }
    }

    @Test

    public void testCalculateCorrectQuantities() { //tests that production quantities re calculated correctly

        var response = given().when().get("/api/production/suggestions").then().statusCode(200).extract().jsonPath();

        int luxuryQuantity = response.getInt("[0].quantity"); //(100/8 = 12 units)
        assert(luxuryQuantity == 12);

        if (response.getList("$").size() > 1) { //another product: after luxury use 96 wood, 4 left. another product needs 2 wood per unit
            int anotherQuantity = response.getInt("[1].quantity");
            assert(anotherQuantity == 2);
        }
    }

    @Test

    public void testTotalValueCalculation() { //tests totalValues correctly calculated

        var response = given().when().get("/api/production/suggestions").then().statusCode(200).extract().jsonPath();

        float price = response.getFloat("[0].productPrice"); //get the values
        int quantity = response.getInt("[0].quantity");
        float total = response.getFloat("[0].totalValue");

        float expected = price * quantity; //calculates expected total
        
        if (Math.abs(total - expected) > 0.01) { //compares with a tolerance to handle floating point precision
            throw new AssertionError("Incorrect total valye. Expected: " + expected + ". Returned value: " + total);
        }

    }
}
