const obj = {
    id: "1",
    name: "Mairaj",
    phone: "92316259269",
    fullName(lastname) {
        return this.name = "Muhammad" + " " + lastname;
    }
}

module.exports = obj;