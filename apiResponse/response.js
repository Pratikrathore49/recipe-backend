class SuccessResponse {
    constructor(data, msg) {
        this.status = true
        this.data = data
        this.message = msg
    }
}

class ErrorResponse {
    constructor(error, msg) {
        this.status = false
        this.error = error
        this.message = msg
    }
}

module.exports = { SuccessResponse, ErrorResponse }