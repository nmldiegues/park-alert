package controllers;

import java.lang.annotation.Annotation;
import java.lang.reflect.Type;

import play.data.binding.Global;
import play.data.binding.TypeBinder;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

@Global
public class JsonObjectBinder implements TypeBinder<JsonObject> {

	@Override
	public Object bind(String arg0, Annotation[] arg1, String arg2, Class arg3,
			Type arg4) throws Exception {
		return new JsonParser().parse(arg2);
	}

}
