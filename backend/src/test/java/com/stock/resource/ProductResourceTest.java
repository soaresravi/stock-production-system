package com.stock.resource;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.*;
import static org.hamcrest.Matchers.greaterThanOrEqualTo;

import jakarta.ws.rs.core.MediaType;
import jakarta.transaction.Transactional;
import jakarta.inject.Inject;

import com.stock.repository.ProductRepository;
import com.stock.repository.ProductRawMaterialRepository;;

@QuarkusTest

public class ProductResourceTest {

    @Inject
    ProductRepository productRepository;

    @Inject
    ProductRawMaterialRepository associationRepository;

    @BeforeEach
    @Transactional
   
    public void cleanup() { //cleans up db before each test execution
        associationRepository.deleteAll(); //associations deleted first due to fk constraints
        productRepository.deleteAll();
    }
    
    @Test

    public void testListAllProducts() { //verifies if the get endpoint return ok status
        given().when().get("/api/products").then().statusCode(200).body("$.size()", greaterThanOrEqualTo(0));
    }

    @Test

    public void testCreateAndGetProduct() {

        String requestBody = "{\"code\":\"TEST001\",\"name\":\"JUnit Test Product\",\"price\":99.99}";

        //tests product creation and extracts the generated id
        var created = given().contentType(MediaType.APPLICATION_JSON).body(requestBody).when().post("/api/products").then()
        .statusCode(201).body("code", equalTo("TEST001")).body("name", equalTo("JUnit Test Product")).body("price", equalTo(99.99f)).extract().path("id");

        //verifies if the new newly created product can be retrivied by id
        given().when().get("/api/products/" + created).then().statusCode(200).body("id", equalTo(created)).body("code", equalTo("TEST001"));
        given().when().delete("/api/products/" + created).then().statusCode(204); //cleans up by deleting the test product
    }

    @Test

    public void testGetProductNotFound() {
        given().when().get("/api/products/99999").then().statusCode(404); //returns 404 for non existent resource ids
    }

    @Test

    public void testCreateProductWithDuplicateCode() {

        String requestBody = "{\"code\":\"DUPLICATE\",\"name\":\"Original\",\"price\":10.0}";

        //first attempt 201 sucess created
        given().contentType(MediaType.APPLICATION_JSON).body(requestBody).when().post("/api/products").then().statusCode(201);
        given().contentType(MediaType.APPLICATION_JSON).body(requestBody).when().post("/api/products").then().statusCode(409);
        //second attempt 409 conflict   
    }

    @Test 

    public void testUpdateProduct() {

        String createBody = "{\"code\":\"UPDATE\",\"name\":\"Before Update\",\"price\":100.0}";

        var id = given().contentType(MediaType.APPLICATION_JSON).body(createBody).when().post("/api/products").then().
        statusCode(201).extract().path("id");

        String updateBody = "{\"code\":\"UPDATE\",\"name\":\"After Update\",\"price\":200.00}";

        given().contentType(MediaType.APPLICATION_JSON).body(updateBody).when().put("/api/products/" + id).then()
        .statusCode(200).body("id", equalTo(id)).body("code", equalTo("UPDATE")).body("name", equalTo("After Update"))
        .body("price", equalTo(200.0f));

        given().when().delete("/api/products/" + id).then().statusCode(204);
    
    }

    @Test

    public void testDeleteProduct() {

        String createBody = "{\"code\":\"DELETE\",\"name\":\"To Be Deleted\",\"price\":50.0}";

        var id = given().contentType(MediaType.APPLICATION_JSON).body(createBody).when().post("/api/products").then()
        .statusCode(201).extract().path("id");

        given().when().delete("/api/products/" + id).then().statusCode(204);
        given().when().get("/api/products/" + id).then().statusCode(404);
    }
}