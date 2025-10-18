const API_URL = 'http://10.0.2.2:3000';

// Esta función se encarga de llamar a nuestro microservicio de API para iniciar una nueva transacción.
export const initiateTransaction = async () => {
  const response = await fetch(`${API_URL}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fromAccount: 'ACC-123',
      toAccount: 'ACC-456',
      amount: Math.floor(Math.random() * 1000) + 50,
      currency: 'USD',
      userId: 'user-987',
    }),
  });

  if (response.status !== 202) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to initiate transaction');
  }

  return response.json();
};