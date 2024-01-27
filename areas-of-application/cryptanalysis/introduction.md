# Cryptanalysis

Computation and communication are secured by cryptography. For example, a user's data can be made private, along with messages that they send or receive, from malicious agents who interfere to try to learn the sensitive information. A set of algorithms collectively called a *cryptosystem* endows the security. The attempt to break security is known as *cryptanalysis*, which has its own set of algorithms. Historically, both cryptography and cryptanalysis considered classical, polynomial-time algorithms as the only realistic ones. The advent of quantum computation forces us to consider attacks via quantum algorithms. Generally, we want to know what is the best algorithm for cryptanalysis, in order to understand the effect on the cryptosystem in the worst case. The effect of quantum attacks can be to void the security of a set of widely used cryptosystems (section on [breaking cryptosystems](../../areas-of-application/cryptanalysis/breaking-cryptosystems.md#breaking-cryptosystems)). More broadly, quantum cryptanalysis can reduce a cryptosystem's security (section on [weakening cryptosystems](../../areas-of-application/cryptanalysis/weakening-cryptosystems.md#weakening-cryptosystems)), such that it becomes more expensive to implement in a secure manner. While the properties of quantum mechanics can also be used to devise more secure cryptosystems (e.g., quantum key distribution) [@bennett1984QKD; @Pirandola2020QKD; @xu2020QKD], we consider this area of cryptography to be outside the scope of the present discussion on quantum algorithms. 





