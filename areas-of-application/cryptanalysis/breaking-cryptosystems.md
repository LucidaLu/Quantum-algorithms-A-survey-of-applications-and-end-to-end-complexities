# Breaking cryptosystems

## Overview

Much of modern cryptography relies on computational assumptions.[^1] A cryptosystem is considered secure if, assuming that a particular mathematical problem is hard to solve, an adversary cannot learn more than a negligible amount of information about what is being encrypted. The earliest such cryptosystems used particular problems from number theory, and variants are widely deployed to this day [@katz2021IntroCryptography]. These cryptosystems are in the class of public-key cryptography, which enables any user to perform tasks like encryption, in contrast to symmetric cryptography, in which users have to pre-share a secret key.


Quantum computers use quantum algorithms to solve computational problems, and in some cases they provide a speedup over the best known classical techniques. When they are applied to the underlying computational task in a cryptosystem, a large speedup over classical methods can break the cryptosystem, in that an adversary efficiently learns the encrypted information to a non-negligible degree. One of the first discovered and most famous applications of quantum computing is Shor's algorithm [@shor1994Factoring], which breaks common methods of public-key cryptography based on number theory, including factoring, discrete logarithm, and elliptic curves. The applications of these public-key cryptosystems include encryption to hide the contents of a message, signatures that prevent tampering and impersonation, and key exchange to generate a key for symmetric cryptography [@bernstein2017PostQuantumCrypto]. In this section, we restrict our focus to two of the most widely used cryptosystems: Rivest–Shamir–Adleman (RSA) and elliptic curves.


## Actual end-to-end problem(s) solved

The RSA cryptosystem [@rivest1978RSA] relies on a user choosing a large number $N$ that is the product of two prime numbers; arithmetic is done modulo $N$. Denote by $n=\lceil \log_2(N) \rceil$ the number of bits specifying $N$. The two prime numbers are kept private, but their product is publicly revealed, along with an exponent $e$. A message $m$ is encrypted as $m^e \bmod N$. By construction, using tricks from number theory, there exists $d$ such that $(m^e)^d \bmod N = m \bmod N$. That is, exponentiating with $d$ performs decryption. The user efficiently solves for the necessary value of $d$ using the Euclidean algorithm, by knowing the prime factors of $N$, along with $e$. However, if an adversary is able to find the factors of $N$ after the construction by the user, they can also solve for $d$ and thereby decrypt messages. The security of the cryptosystem comes from the difficulty of factoring large numbers, i.e., finding the two primes that multiply to $N$.


A similar cryptosystem is based on elliptic curves, which has the advantage that classical algorithms attacking it are even less successful than for RSA, so the ratio of bits of security (quantifying the number of attacks needed to learn the encrypted information; see section on [weakening cryptosystems](../../areas-of-application/cryptanalysis/weakening-cryptosystems.md#weakening-cryptosystems) for details) relative to key size is larger. Consequently, fewer resources (e.g., communication, complexity of encryption and decryption) are required to implement elliptic curve cryptography. Instead of using the multiplicative group of a finite field, consider points on an elliptic curve [@koblitz1987ECC; @miller1986ECC]: $$\begin{equation} y^2=x^3+ax+b\,,\quad a,b\in K\,, \end{equation}$$ where $K$ is a field. A special group operation can be defined over points $(x,y)$ lying on the elliptic curve. Then, given a secret number $c$ and a point $P = (x,y)$, the point $P$ can be added to itself under this operation $c$ times, yielding the point $P'=cP$, which can be efficiently computed from $c$ and $P$. Multiplication by $c$ is analogous to the exponentiation in RSA, above. The assumption of hardness is in the following problem, known as the elliptic curve discrete logarithm problem (ECDLP): *For two points $P,P'$ on an elliptic curve, find an integer $c$ such that $P'=cP$*. As an example of this cryptosystem, for a publicly known point $P$, a receiver chooses a secret $c$ and publishes $cP$. The sender chooses a random integer $d$ and encrypts the message $m$ as $m+ d(cP)$, also sending $dP$. Since group multiplication is commutative, to decrypt the message, the receiver multiplies $dP$ by $c$ and subtracts the product from the encrypted message.


## Dominant resource cost/complexity

Shor's algorithm [@shor1994Factoring] solves the number-theoretic problem of order finding: given $n$-bit positive integer $N$ and $x$ coprime to $N$, find the smallest integer $r$ such that $x^r=1 \bmod N$. Factoring was shown to reduce to order finding. In particular, there is an efficient, otherwise classical algorithm, of classical complexity $\mathcal{O}\left( n^3 \right)$ [@nielsen2002QCQI], that uses order finding as a quantum subroutine. To describe the quantum algorithm for order finding, let the function $f$ denote modular exponentiation, i.e., $f(e) = x^e \bmod N$, and note that $f$ is periodic with (unknown) period $r$. Also, let $L$ be a large integer such that an interval of length $L$ contains many periods, i.e., $L \gg r$. It can be shown that $L \geq N^2$ is sufficient. There are three steps. First, an equal superposition over the numbers $\{0,\ldots,L-1\}$ is formed and the function $f$ is computed into an ancilla register yielding the state $L^{-1/2}\sum_{e=0}^{L-1} \ket{e}\ket{f(e)}$. Second, a measurement is performed on the ancilla register, which, due to the periodicity of the function $f$, yields a state $(\lceil L/r \rceil)^{-1/2} \sum_{j=0}^{\lfloor L/r \rfloor}\ket{rj + y}$ for $0\leq y<r$ a random and unknown integer.[^2] Third, a [quantum Fourier transform](../../quantum-algorithmic-primitives/quantum-fourier-transform.md#quantum-fourier-transform) is performed. In the case that $L$ is a multiple of $r$, the result is $$\begin{equation} \frac{\sqrt{r}}{L}\sum_{j=0}^{L/r} \sum_{z=0}^{L-1}e^{2\pi i z(rj+y)/L} \ket{z} = \frac{1}{\sqrt{r}}\sum_{\ell=0}^{r-1}e^{2\pi i \ell y/r} \ket{\ell L/r } \,, \end{equation}$$ where the equality follows since coefficients of $\ket{z}$ for which $z$ is not equal to $\ell L/r$ for some integer $\ell$ vanish due to destructive interference. Measurement of this state then produces an outcome $\ell L/r$ for a random choice of $\ell$. The value of $r$ can be classically computed by dividing the measurement outcome by $L$ and determining the value of the denominator of the rational number that results; repetition may be required since $\ell$ and $r$ could have common divisors. If $L/r$ is not an integer, the measurement outcome is (with high probability) an integer close to $\ell L / r$ for some integer $\ell$. One can deduce the rational number $\ell/r$ (which allows for the determination of $r$) from the estimate of $\ell L /r$ by writing it as a continued fractions expansion, with classical complexity $\mathcal{O}\left( n^3 \right)$ [@nielsen2002QCQI].


This entire procedure can alternatively be viewed as [quantum phase estimation](../../quantum-algorithmic-primitives/quantum-phase-estimation.md#quantum-phase-estimation) applied to the unitary $U$ that sends $\ket{y}\mapsto \ket{xy \bmod N}$ for all $y$ relatively prime to $N$, performed with at least $2n$ bits of precision.


The number of qubits for order finding is $\mathcal{O}\left( n \right)$, which stems from the number of bits specifying the problem: the first register has size $2n$, and the ancilla register holding the result $f(e)$ has size $n$. Naively, the number of operations is $\mathcal{O}\left( n^2 \right)$ for the quantum Fourier transform and $\mathcal{O}\left( n^3 \right)$ for implementing the coherent modular exponentiation $\ket{e}\ket{0} \mapsto \ket{e}\ket{x^e \bmod N}$. The bottleneck in the complexity is thus from reversible circuits for modular arithmetic. These circuits are closely related to those in classical computing that have been optimized. The best scaling in theory is achieved with algorithms that have large prefactors in their complexity, making them impractical to implement except for large numbers: $\mathcal{O}\left( n^2\log(n) \right)$ is possible asymptotically, using integer multiplication with $\mathcal{O}\left( n\log(n) \right)$ scaling [@harvey2021IntegerMultiplication]. Alternatively, optimization may be performed to, e.g., increase qubit count and decrease gate count. For example, an approximate version of the quantum Fourier transform is implemented with $\mathcal{O}\left( n\log(n) \right)$ gates and allows factoring with $\mathcal{O}\left( \log (n) \right)$-depth quantum circuits [@cleve2000FastQFT], at the cost of extra overhead in number of qubits and gates; allowing for $\mathcal{O}\left( \log^2 (n) \right)$-depth preserves the circuit size $\mathcal{O}\left( n^3 \right)$.


A related approach proposed by Regev [@regev2023efficient] for quantum factoring has quantum circuit size of only $\widetilde{\mathcal{O}}\left( n^{3/2} \right)$ gates but the circuit has to be run $\mathcal{O}\left( n^{1/2} \right)$ times. Furthermore, the algorithm relies on a plausible number-theoretic assumption. The reduction in quantum circuit size may lead to more favorable resource counts in practice.


Essentially the same quantum algorithm of Shor is readily applied to elliptic curves, as well as the discrete logarithm problem (i.e., find $r$ such that $a^r=b$ for $a,b\in G$ where $G$ is a group) that also is used as a computationally hard problem for cryptography. These applications are all instances of the *hidden subgroup problem*: Find the generators for subgroup $K$ of a finite group $G$, given a quantum oracle performing $U\ket{g}\ket{h}=\ket{g}\ket{h \oplus f(g)}$, where $f:G\to X$ ($X$ is a finite set) is a function that is promised to be constant on the cosets of $K$ and take unique values on each coset. In the case of period finding, $G$ is the group $\mathbb{Z}/L\mathbb{Z}$ under addition, and the hidden subgroup is $K = \{0,r,2r,\ldots,L-r\}$ (technically a subgroup only if $r$ divides $L$); one can verify that $f(g) = x^g \bmod N$ is constant on each coset of $K$. The procedure outlined above for period finding can be applied to other groups, where it is called "the standard method" [@childs2010QAlgosForAlgebraicProblems] (which requires generalizing the [quantum Fourier transform](../../quantum-algorithmic-primitives/quantum-fourier-transform.md#quantum-fourier-transform) to arbitrary groups). For abelian groups, the hidden subgroup $K$ can be determined with $\mathrm{polylog}(|G|)$ queries to $f$, but the method does not work for nonabelian groups, such as the symmetric group and the dihedral group.


## Existing error corrected resource estimates

The minimum recommended key size for RSA is 2048 bits [@barker2015KeyRecommendation]. Optimizations in the circuits [@beauregard2003ShorCircuit; @haner2017factoringToffolis] and incorporation of hardware constraints [@fowler2012SurfaceCodes] have led to decreasing but also more realistic resource estimates. For key size 2048, assuming nearest-neighbor connectivity, about $14000$ logical qubits (which includes space for routing and distillation; see sections on [quantum error correction](../../fault-tolerant-quantum-computation/quantum-error-correction-with-the-surface-code.md#quantum-error-correction-with-the-surface-code) and [lattice surgery](../../fault-tolerant-quantum-computation/logical-gates-with-the-surface-code.md#logical-gates-with-the-surface-code)) and $3\times 10^9$ Toffoli gates are necessary [@gidney2021HowToFactor].


For elliptic curve cryptography, the minimum recommended key size to ensure 128-bit security, is 256 bits [@barker2015KeyRecommendation] (achieving the same level of security with RSA requires a key size of 3072 bits [@boudot2020Factorization240Digit; @roetteler2017ResourceEstimatesEllipticCurve]). For breaking 256-bit elliptic curve cryptography, it is estimated that around three times fewer logical qubits, and 100 times fewer Toffoli gates are required (compared to 3072-bit RSA) [@roetteler2017ResourceEstimatesEllipticCurve]. Similar to factoring, improvements have been made in circuit compilation [@haner2020ImprovedEllipticCurve] and hardware considerations [@webber2022HardwareSpecifications], resulting in an estimate of 2871 logical qubits and $5.76\times 10^9$ $T$ gates (note that one Toffoli gate costs around 4 $T$ gates). As a conclusion, breaking elliptic curve cryptography is easier than factoring for quantum computers in practice [@proos2003ShorEllipticCurves], relative to their practical difficulty on classical computers.


In both cases (2048-bit RSA [@gidney2021HowToFactor; @ha2022ShorResources] and 256-bit elliptic curves [@webber2022HardwareSpecifications]), given current hardware schemes based on surface codes, the number of physical qubits is estimated to be on the order of $10$ million and the computation runs for around $10$ hours. For a discussion on how to convert between logical and physical resources, see the section on [fault-tolerant quantum computation](../../fault-tolerant-quantum-computation/introduction.md#fault-tolerant-quantum-computation). Optimization based on the particular architecture can give improvements to these estimates. For example, assuming a logarithmic number of nonlocal links, as in photonic implementations, enables breaking elliptic curves around 200 times faster [@litinski2023EllipticCurvesBaseline]. The algorithms considered in the resource estimates above do not achieve the best known asymptotic scaling, which comes at the cost of large constant prefactors.


## Caveats

While the popular cryptosystems based on number-theoretic problems are rendered insecure for public-key cryptography, there exist alternatives that are believed to be secure against quantum computers: e.g., based on error-correcting codes or lattices [@bernstein2017PostQuantumCrypto]. These alternative computational problems are believed to be hard for both classical and quantum computers. The National Institute of Standards and Technology (NIST) of the United States plans to provide standards by 2024 to prompt implementation [@alagic2022PostQuantumCryptoStatus3]. The class of symmetric cryptography (see a standard text [@katz2021IntroCryptography] for details) involves computations that do not have much structure, and also is not broken by quantum computers. Instead, [the number of bits of security is reduced](../../areas-of-application/cryptanalysis/weakening-cryptosystems.md#weakening-cryptosystems).


Prior experimental demonstrations of Shor's algorithm have used knowledge of the answer in order to optimize the circuit and thus lead to sizes that are experimentally feasible on non-error-corrected devices. Meaningful demonstration should avoid such shortcuts [@smolin2013OverQF], which are not available in realistic cryptographic scenarios.


## Comparable classical complexity and challenging instance sizes

The best known classical algorithm for factoring is the number field sieve, which has time complexity super-polynomial in number of bits $n$: namely, it scales as $\mathcal{O}\left( \exp(p\cdot n^{1/3}\log^{2/3}(n)) \right)$, where $p>1.9$. With a hybrid quantum-classical algorithm applying [amplitude amplification](../../quantum-algorithmic-primitives/amplitude-amplification-and-estimation/amplitude-amplification.md#amplitude-amplification) on the number field sieve, $p= 1.387$ can be achieved using a number of qubits scaling only as $\mathcal{O}\left( n^{2/3} \right)$ [@bernstein2017LowResourceFactoring]. Classically, problems of size 795 bits have been factored, taking 76 computer core-years, which distributed in parallel over a cluster took 12 days; the same team then extended the record to 829 bits [@boudot2020Factorization240Digit].


Several algorithms attacking elliptic curve cryptography have complexity $\mathcal{O}\left( 2^{n/2} \right)$ [@washington2003elliptic], leading to the recommended doubling of key size compared to bits of security. In practice, a problem of size 117 bits was solved [@bernstein2016ECCFPGA].


## Speedup

The number of gates to implement Shor's algorithm is $\widetilde{\mathcal{O}}\left( n^2 \right)$ asymptotically using fast multiplication on large numbers [@beckman1996EfficientNetworksFactoring]. More practically, without incurring the time overhead and additional storage space of fast multiplication, the scaling is $\mathcal{O}\left( n^3 \right)$. Assuming classical and quantum gates are polynomially related in time complexity, the speedup is super-polynomial. However, there are no tight lower bounds on the classical complexity of factoring or ECDLP; it remains possible that more efficient classical algorithms could be discovered.


## NISQ implementations

The large circuit depth, complicated operations, and high number of qubits needed to implement Shor's algorithm make faithful NISQ implementation challenging. However, there have been several attempts to ease implementation at the expense of losing the guarantees of Shor's algorithm, in the hope that the output is still correct with some nonzero probability, which could be vanishing.


One approach [@rossi2022ReducedShor] is to simplify several operations and make them approximate. The outcome is that the circuit depth is $\mathcal{O}\left( n^2 \right)$, saving a factor of $n$ [@haner2017factoringToffolis]. The depth is then about $10^8$ to factor a 1024-bit instance of RSA, so for relevant sizes, error correction is still required. Implementation of the approximate algorithm, including experimentally, allowed for the successful factorization of larger problem instances than had been possible before. This approximate version is not NISQ in the usual sense of involving noisy circuits, but rather introduces some uncontrolled approximation error in return for reducing the depth, for the possibility of a useful result. Another approach is to encode the factoring problem in a [variational optimization circuit](../../quantum-algorithmic-primitives/variational-quantum-algorithms.md#variational-quantum-algorithms). Again, performance is not guaranteed; moreover, variational optimization applied to generic problems is expected to have, at best, a quadratic improvement compared to classical methods, leaving no hope for breaking cryptography. Classical simulation on small problem sizes shows that the algorithm can succeed [@anschuetz2019variationalfactoring], as does experimental implementation on a superconducting quantum processor [@karamlou2021VariationalFactoringSuperconducting]. We emphasize that, generally, these NISQ approaches have no evidence or arguments for scaling to cryptographically relevant system sizes.


## Outlook

The existence of Shor's algorithm implies common RSA and elliptic curve schemes are theoretically not secure, and resource estimates have made clear what scale of quantum hardware would break them. While such hardware does not exist currently, progress towards such a device can be used to inform the speed of transitioning to quantum-resistant encryption [@chen2016PostQuantumCrypto]. Currently, from a hardware perspective, the field of quantum computing is far from implementing algorithms that would break encryption schemes used in practice. The estimates above suggest that the resources required would be millions of physical qubits performing billions of Toffoli gates running on the timescale of days. In contrast, current state-of-the-art is on the order of one hundred noisy physical qubits, with progress towards demonstration of a single logical qubit. Running fault-tolerant quantum computation requires extra overhead, such as magic state factories (see the sections on [quantum error correction](../../fault-tolerant-quantum-computation/quantum-error-correction-with-the-surface-code.md#quantum-error-correction-with-the-surface-code) and [lattice surgery](../../fault-tolerant-quantum-computation/logical-gates-with-the-surface-code.md#logical-gates-with-the-surface-code)). Thus, the gap between state-of-the-art hardware and the requirements for breaking cryptosystems is formidable. Moreover, a linear increase in key size will increase, e.g., the number of Toffoli gates by a power of three, which can be substantial. Therefore, considering the experimental challenges, likely only the most sensitive data will be at risk first, rather than common transactions. Consequently, these highly confidential communications will likely adopt post-quantum cryptography first to avoid being broken. However, insecure protocols often linger in practice, so quantum computers can exploit any vulnerabilities in deployed systems that have not been addressed. For example, RSA keys of size 768 bits have been found in commercial devices (note that such key sizes can already be broken classically [@boudot2020Factorization240Digit]). In addition, intercepted messages, encrypted with RSA or elliptic curves, can be stored now and decrypted later, once large-scale quantum computers become available.


The resilience of candidates for post-quantum cryptography is under active investigation. In particular, specialized quantum attacks [@peikert2020CSievesCSIDH] can reduce the number of bits of security, [weakening](../../areas-of-application/cryptanalysis/weakening-cryptosystems.md#weakening-cryptosystems) the cryptosystem. Classical attacks have even broken certain cryptosystems [@castryck2023EfficientSIDH]. Note that these attacks affect the feasibility of particular proposals, but there exist other post-quantum candidates that have no known weaknesses.


A sensitive area that warrants additional discussion is cryptocurrency, since much of the encryption relies on the compromised, number-theoretic, public-key cryptography. Moreover, changing the cryptographic protocol of the currency requires that most of the users reach a consensus to do so, which can be challenging to coordinate, even if the technical hurdles of adopting post-quantum encryption are overcome. Cryptocurrency wallets that have revealed their public key (for example, via a transaction reusing a public key assigned to that wallet previously) can be broken using Shor's algorithm. An attack is also possible during the short time-window in which the key is revealed during a single transaction [@aggarwal2018QuantumAttacksBitcoin]. Different cryptocurrencies have different levels of susceptibility to these types of attacks [@deloitte2019Bitcoin; @deloitte2022ethereum]. Nevertheless, the mining of cryptocurrency is not broken, but only [weakened by quantum computers](../../areas-of-application/cryptanalysis/weakening-cryptosystems.md#weakening-cryptosystems). 






[^1]: An example of a cryptosystem not requiring computational assumptions is the one-time pad.


[^2]: If $r\lfloor L/r \rfloor+y \geq L$, then the $j = \lfloor L/r \rfloor$ term does not appear in the expression.
