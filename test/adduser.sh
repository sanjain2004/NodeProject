#curl -H "Content-Type: application/json" -X POST -d '{"firstName":"i2","lastName":"i2", "userName":"inv2", "email":"a@a.com", "password":"a", "state":"MA", "phone":"123", "licNumber":"1", "licExpiry":"2016-01-01","companyName":"co2", "practice":"commercial"}' localhost:3000/user/investigator/signup
curl -H "Content-Type: application/json" -X POST -d '{"firstName":"c3","lastName":"c3", "userName":"c3", "email":"b@a.com", "password":"a", "state":"MA", "phone":"123"}' localhost:3000/user/client/signup
echo
