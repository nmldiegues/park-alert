package com.emel.exceptions;

public class EmelException extends Throwable{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String exception;
	
	public EmelException(String e){
		exception = e;
	}
	
	public String getException(){
		return exception;
	}
}
