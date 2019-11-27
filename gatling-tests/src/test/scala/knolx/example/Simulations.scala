package knolx.example

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import scala.concurrent.duration._
import com.typesafe.config._

class Simulations extends Simulation {

  object get {
    val validUser = repeat(10) {
      exec(http("Get Valid User")
        .get("/user").check(status.find.in(200)))
    }
    /*val inValidUser = repeat(10) {
      exec(http("Get InValid User")
        .get("/wronguser").check(status.find.in(400,401,404,501,502))
        .headers(headers_1))
        .pause(1)
    }*/
  }
  val httpConf = http
    .baseURL(ConfigFactory.load("gatling.properties").getString("BASE_URL_LOCAL"))
    .acceptHeader("application/json; charset=utf-8")
    .doNotTrackHeader("1")
    .acceptLanguageHeader("en-US,en;q=0.5")
    .acceptEncodingHeader("gzip, deflate")
    .userAgentHeader("Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:16.0) Gecko/20100101 Firefox/16.0")

  val validUserScenario = scenario("GetUser").exec(get.validUser)

  setUp(validUserScenario.inject(rampUsers(25) over (10 seconds)).protocols(httpConf))

}

