#!/usr/bin/env python3

if __name__ == "__main__":
    from cryptography.fernet import Fernet
    cipher_key = b'1OWU3m77xWS5r_CfcQ63mRlyQDvR3VEfud4Img8psVE='
    print(cipher_key)
    print(cipher_key.decode('utf-8'))
    cipher = Fernet(cipher_key)
    text = 'My super secret message My super secret messag My super secret messag My super secret messag My super secret messag My super secret messag'.encode('utf-8')
    encrypted_text = cipher.encrypt(text)
    print(encrypted_text.decode('utf-8'))
    decrypted_text = cipher.decrypt(encrypted_text)
    print(decrypted_text)
