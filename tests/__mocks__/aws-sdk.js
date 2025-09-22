// AWS SDK Mock for testing
module.exports = {
  config: {
    update: jest.fn()
  },
  S3: jest.fn().mockImplementation(() => ({
    upload: jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Location: 'https://s3.example.com/file.txt' })
    }),
    getObject: jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Body: 'test content' })
    })
  })),
  SecretsManager: jest.fn().mockImplementation(() => ({
    getSecretValue: jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({ SecretString: '{"key":"value"}' })
    })
  })),
  Lambda: jest.fn().mockImplementation(() => ({
    invoke: jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Payload: '{"result":"success"}' })
    })
  }))
};