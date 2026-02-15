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

import com.stock.repository.RawMaterialRepository;
import com.stock.repository.ProductRawMaterialRepository;

@QuarkusTest

public class RawMaterialResourceTest {

    @Inject
    RawMaterialRepository rawMaterialRepository;
    
    @Inject
    ProductRawMaterialRepository associationRepository;

    @BeforeEach
    @Transactional

    public void cleanup() { 
        associationRepository.deleteAll();
        rawMaterialRepository.deleteAll();
    }
    
    @Test

    public void testListAllRawMaterials() {
        given().when().get("/api/raw-materials").then().statusCode(200).body("$.size()", greaterThanOrEqualTo(0));
    }

    @Test

    public void testCreateAndGetRawMaterial() {

        String requestBody="{\"code\":\"RM_TEST001\",\"name\":\"Test Wood\",\"stockQuantity\":100}";

        var created = given().contentType(MediaType.APPLICATION_JSON).body(requestBody).when().post("/api/raw-materials").then()
        .statusCode(201).body("code", equalTo("RM_TEST001")).body("name", equalTo
        ("Test Wood")).body("stockQuantity", equalTo(100)).extract().path("id");

        given().when().get("/api/raw-materials/" + created).then().statusCode(200).body("id", equalTo(created))
        .body("code", equalTo("RM_TEST001")).body("name", equalTo("Test Wood")).body("stockQuantity", equalTo(100));
        
        given().when().delete("/api/raw-materials/" + created).then().statusCode(204);
    }

    @Test

    public void testGetRawMaterialNotFound() {
        given().when().get("/api/raw-materials/99999").then().statusCode(404);
    }

    @Test

    public void testCreateRawMaterialWithDuplicateCode() {

        String requestBody = "{\"code\":\"RM_DUPLICATE\",\"name\":\"Original\",\"stockQuantity\":50}";

        given().contentType(MediaType.APPLICATION_JSON).body(requestBody).when().post("/api/raw-materials").then().statusCode(201);
        given().contentType(MediaType.APPLICATION_JSON).body(requestBody).when().post("/api/raw-materials").then().statusCode(409);
    
    }

    @Test

    public void testUpdateRawMaterial() {

        String createBody = "{\"code\":\"RM_UPDATE\",\"name\":\"Before Update\",\"stockQuantity\":100}"; //creates a RM to be updated later

        var id = given().contentType(MediaType.APPLICATION_JSON).body(createBody).when().post("/api/raw-materials").then().
        statusCode(201).extract().path("id");

        String updateBody = "{\"code\":\"RM_UPDATE\",\"name\":\"After Update\",\"stockQuantity\":200}"; //json body with updated values

        given().contentType(MediaType.APPLICATION_JSON).body(updateBody).when().put("/api/raw-materials/" + id).then().
        statusCode(200).body("id", equalTo(id)).body("code", equalTo("RM_UPDATE")).body("name", equalTo("After Update"))
        .body("stockQuantity", equalTo(200)); //sends a put request to update the raw material. verifies that the data was updated correctly

        given().when().delete("/api/raw-materials/" + id).then().statusCode(204);

    }

    @Test

    public void testDeleteRawMaterial() {

        String createBody = "{\"code\":\"RM_DELETE\",\"name\":\"To Be Deleted\",\"stockQuantity\":50}";

        var id = given().contentType(MediaType.APPLICATION_JSON).body(createBody).when().post("/api/raw-materials").then()
        .statusCode(201).extract().path("id");

        given().when().delete("/api/raw-materials/" + id).then().statusCode(204); //deletes the raw material
        given().when().get("/api/raw-materials/" + id).then().statusCode(404); //verifies why hes no longer accessible
    }
}