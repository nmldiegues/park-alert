package models;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import play.data.validation.Required;
import play.db.jpa.Model;

@Entity
public class Rank extends Model {

	@Required
	public String username;
	@Required
	public Long rank;
	@Required
	public Long score;
	@Required
	public boolean requester;
	
	public Rank(String username, Long rank, Long score, boolean requester) {
		super();
		this.username = username;
		this.rank = rank;
		this.score = score;
		this.requester = requester;
	}
	
}
