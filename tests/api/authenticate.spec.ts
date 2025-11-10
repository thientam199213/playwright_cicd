import test, { expect } from "@playwright/test";

test.describe('Verify API authentication', () => {
    test('@smoke should authenticate using API and set token in local storage', async ({ page, request }) => {
        // Step 1: Authenticate via API
        const response = await request.post('https://demoqa.com/Account/v1/GenerateToken', {
            data: {
                userName: 'testuser',
                password: 'Test@1234'
            }
        });
        expect(response.ok()).toBeTruthy();
        const responseBody = await response.json();
        const token = responseBody.token;
        expect(token).toBeDefined();
        // Step 2: Set token in local storage
        await page.addInitScript((token) => {
            window.localStorage.setItem('token', token);
        }, token);
    });

    test('@smoke verify the reponse format data and data type', async ({ page, request }) => {
        // Step 1: Authenticate via API
        const response = await request.post('https://demoqa.com/Account/v1/GenerateToken', {
            data: {
                userName: 'testuser',
                password: 'Test@1234'
            }
        });
        expect(response.ok()).toBeTruthy();
        const responseBody = await response.json();
        const expectedKeys = ['token', 'expires', 'status', 'result']; 
        for (const key of expectedKeys) {
            expect(responseBody).toHaveProperty(key);
            // console.log(`Key: ${key}, Value: ${responseBody[key]}`);
            const value = responseBody[key];
            expect(typeof value).toBe('string');
        }
        
    });

    test('Verify authentication with wrong parameter value', async ({ page, request }) => {
        // Step 1: Authenticate via API
        const response = await request.post('https://demoqa.com/Account/v1/GenerateToken', {
            data: {
                userName: 'abc',
                password: '1234@1234'
            }
        });
        expect(response.ok()).toBeTruthy();
        const responseBody = await response.json();
        const token = responseBody.token;
        expect(token).toBe(null);
        const result = responseBody.result;
        expect(result).toBe("User authorization failed.");
        const status = responseBody.status;
        expect(status).toBe("Failed");
    });

    test('Verify authentication with empty parameter value', async ({ page, request }) => {
        let response = await request.post('https://demoqa.com/Account/v1/GenerateToken', {
            data: {
                userName: '',
                password: '1234@1234'
            }
        });
        expect(response.ok()).toBeFalsy();
        let responseBody = await response.json();
        let token = responseBody.token;
        expect(token).toBeUndefined();
        expect(responseBody.code).toBe("1200");
        expect(responseBody.message).toBe("UserName and Password required.");
        expect(response.status()).toBe(400);

        response = await request.post('https://demoqa.com/Account/v1/GenerateToken', {
            data: {
                userName: 'testuser',
                password: ''
            }
        });
        expect(response.ok()).toBeFalsy();
        responseBody = await response.json();
        token = responseBody.token;
        expect(token).toBeUndefined();
        expect(responseBody.code).toBe("1200");
        expect(responseBody.message).toBe("UserName and Password required.");
        expect(response.status()).toBe(400);
    });
});