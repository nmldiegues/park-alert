package models;


import java.util.ArrayList;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.ManyToMany;

import play.data.validation.Required;
import play.db.jpa.Model;

@Entity
public class Badge extends Model {

	@Required
	public String name;
	@Required
	public byte[] image;
	@ManyToMany
	public List<User> users;
	
	public Badge(String name, byte[] image, User user) {
		super();
		this.name = name;
		this.image = image;
		this.users = new ArrayList<User>(); 
	}
	
}
