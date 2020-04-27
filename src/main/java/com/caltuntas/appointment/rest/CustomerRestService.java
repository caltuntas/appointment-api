/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.caltuntas.appointment.rest;

import com.caltuntas.appointment.dto.CreateCustomerRequest;
import com.caltuntas.appointment.dto.UpdateCustomerRequest;
import com.caltuntas.appointment.model.Customer;
import com.caltuntas.appointment.service.CustomerService;

import io.swagger.annotations.ApiOperation;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import org.springframework.web.bind.annotation.RequestParam;

/**
 *
 * @author emehalt
 */
@CrossOrigin
@RestController
@EnableAutoConfiguration
@RequestMapping("/customers")
public class CustomerRestService {   
    @Autowired
    private CustomerService service;
    
    @RequestMapping(value = "", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)     
    @ApiOperation("Returns customer with given id ")
    public List<Customer> getAll(@RequestParam("filter") String filter) {
    	return service.getAll(filter);    	
    }
    
    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)     
    @ApiOperation("Returns customer with given id ")
    public Customer getById(@PathVariable("id") String id) {
    	return service.getById(id);    	
    }
    
    @RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation("Creates a customer")
    public Customer create(@Valid @RequestBody CreateCustomerRequest request) {
    	Customer response = service.createCustomer(request);
        return response;
    }
    
    @RequestMapping(method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation("Updates a customer")
    public Customer update(@Valid @RequestBody UpdateCustomerRequest request) {
    	Customer response = service.updateCustomer(request);
        return response;
    }
}
