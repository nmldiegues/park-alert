package models;

import java.math.BigInteger;
import java.util.Calendar;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.OneToOne;

import play.data.validation.Required;
import play.db.jpa.Model;

@Entity
public class Token extends Model {

	@Required
	public String value;
	
	@Required
	public Date validity;
	
	@Required
	@OneToOne
	public User owner;
	
	public Token(User owner) {
		this.owner = owner;
		this.value = new BigInteger(128, User.random).toString(32);
		Calendar c = Calendar.getInstance();
		c.setTime(new Date());
		c.add(Calendar.MINUTE, 30);
		this.validity = c.getTime();
	}
	
}
