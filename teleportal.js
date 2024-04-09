import { Web5 } from '@web5/api';
console.log("foo");

Web5.password = "Ihatepasswordssomuch";

const { web5, did: bobDid } = await Web5.connect();

console.log(bobDid);

const { record } = await web5.dwn.records.create({
    data: {
        content: "Hello Web5",
        description: "Keep Building!"
    },
    message: {
        dataFormat: 'application/json'
    }
});

console.log(record);
record.data.json().then(console.log);
