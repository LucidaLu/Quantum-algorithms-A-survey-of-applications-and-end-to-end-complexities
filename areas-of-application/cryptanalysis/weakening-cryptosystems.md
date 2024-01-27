# Weakening cryptosystems

## Overview

The discovery of Shor's algorithm (see [Breaking cryptosystems](../../areas-of-application/cryptanalysis/breaking-cryptosystems.md#breaking-cryptosystems)) prompted interest in post-quantum cryptography, the study of cryptosystems assuming the presence of large-scale, working quantum computers [@bernstein2017PostQuantumCrypto]. While some existing systems retained confidence in their security, others that were broken by quantum algorithms were superseded by those that accomplish the same task, but are believed to maintain a high level of security against quantum attacks.


Even if a cryptosystem is not broken altogether, its degree of security can be weakened by quantum algorithms. The strength of a cryptosystem is typically quantified by the number of bits of security, i.e., $n$ bits corresponds to guessing the desired information with probability $1/2^n$ and accessing what is being protected. *Breaking* a cryptosystem means only an efficient number of attempts (i.e., $\mathrm{poly}(n)$) are needed, while an attack that *weakens* a cryptosystem still takes $2^m > \mathrm{poly}(n)$ attempts, for some $m<n$.


In contrast to public-key cryptosystems, symmetric-key cryptography was discovered earlier and has fewer capabilities. However, it relies less on the presumed hardness of underlying mathematical problems, and correspondingly has only been weakened by quantum cryptanalysis, as discussed in more detail below.


## Actual end-to-end problem(s) solved

In symmetric-key cryptography, two communicating parties share the same key $K$, which is used both in encryption $\mathit{Enc}_K$ and decryption $\mathit{Dec}_K$. As usual, the cryptographic algorithm $(\mathit{Enc}_K,\mathit{Dec}_K)$ is known to everyone, including adversaries. Then, the task of the adversary is to learn the key, given access to $r$ pairs of plaintext (the message $m$) and corresponding ciphertext $c$ (its encryption). Such a pair can be accessed by, e.g., forcing a certain test message to be transmitted. Precisely, an input $K$ is sought for which the following function outputs 1: $$\begin{equation} f(K) = (\mathit{Enc}_K(m_1)=c_1 \land \ldots \land \mathit{Enc}_K(m_r)=c_r) \,, \end{equation}$$ i.e., find a key such that all the messages encrypt correctly. A straightforward attack is to use brute force and test every key; in practice, sophisticated classical attacks do not perform better than this approach in asymptotic scaling.


## Dominant resource cost/complexity

The main, generic quantum attack is to use [amplitude amplification](../../quantum-algorithmic-primitives/amplitude-amplification-and-estimation/amplitude-amplification.md#amplitude-amplification): given a classical algorithm with success probability $\mathcal{O}\left( 2^{-n} \right)$ of finding a solution, the probability is increased quadratically to $\mathcal{O}\left( 2^{-n/2} \right)$. Thus, applying amplitude amplification to the task of solving for the key, the security of cryptosystems goes from $n$ bits to $n/2$.


The function queried in superposition must be efficient to evaluate with a quantum circuit, which is often the case in cryptography [@bernstein2017PostQuantumCrypto]. However, the operations are typically long sequences of Boolean arithmetic. As such, a universal gate set and fault-tolerant computation are still required. To store the key, $\mathcal{O}\left( n \right)$ register qubits are needed, and many more ancilla qubits are used for the reversible arithmetic.


## Existing error corrected resource estimates

Consider the Advanced Encryption Standard (AES) [@nist2001AES], a symmetric encryption algorithm that is widely used in cryptosystems, e.g., for encrypting web traffic. At a high level, it mixes the plaintext and adds it to the key to obtain the ciphertext. An attack based on amplitude amplification needs around 3000–7000 logical qubits [@grassl2016GroverAESResourceEstimates] for AES-$k$, where $k$ denotes key size in bits, and $k\in \{128,192,256\}$. For these sizes, the number of necessary problem instances $r$ is three to five. While the number of logical qubits roughly doubles going from AES-128 to AES-256, the number of $T$ gates goes from $2^{86} \approx 10^{25}$ to $2^{151} \approx 10^{45}$.


## Caveats

Since the quantum attack only halves the exponent in the complexity, a simple fix is to double the key length, e.g., adopting AES-256 instead of AES-128. This modification results in increased, but usually tolerable, cost in implementation (i.e., complexity of encryption and communication resources). In addition, there exist cryptosystems with an information-theoretic security guarantee, assuming adversaries with unlimited computational power, which covers against quantum attacks [@bernstein2017PostQuantumCrypto].


Furthermore, it is important to note that to realize the full quadratic benefit of [amplitude amplification](../../quantum-algorithmic-primitives/amplitude-amplification-and-estimation/amplitude-amplification.md#amplitude-amplification), the $2^{n/2}$ function queries must be performed in series. In contrast, classical brute-force attacks can exploit the parallelism available in high-performance classical computers, potentially increasing the value of $n$ for which a quantum approach would be advantageous over classical methods.


## Comparable classical complexity and challenging instance sizes

Classical algorithmic attacks on AES have reduced the security by only a few bits [@bogdanov2011BicliqueAES]. More practical are side-channel attacks, which make use of physical byproducts, such as energy consumption. For example, when comparing bits between a key and another string, a flipped value can result in logic that increases energy consumption, compared to the same value where nothing happens. The two cases are distinguished and information about the key is learned. 128 bits of security is currently about the minimum recommended amount [@barker2020KeyRecommendation].


## Speedup

The basic speedup is quadratic: $\mathcal{O}\left( \sqrt{N} \right)$ function evaluations compared to $\mathcal{O}\left( N \right)$ classically, where $N$ denotes the number of possibilities for the key; i.e., $n=\lceil \log_2(N) \rceil$. However, the function queries in amplitude amplification cannot be parallelized. Then, the evaluation time of the function sets a bottleneck [@bernstein2017PostQuantumCrypto]. That is, the problem size is limited by the number of function evaluations $T$ that can be run in an acceptable period of time. For $\sqrt{N}>T$, employing $p$ parallel quantum processors, each executes $T=\sqrt{N/p}$ evaluations. Then, $p=\mathcal{O}\left( N/T^2 \right)$ and the total number of evaluations is $pT=\mathcal{O}\left( N/T \right)$, whereas classically, the number of processors is $\mathcal{O}\left( N/T \right)$ and total evaluations is $\mathcal{O}\left( N \right)$. The advantage is a factor of $T$, which is the bottleneck, rather than the larger $\sqrt{N}$. However, the advantage can be overshadowed by faster or cheaper classical processing. That is, if classical computers evaluate the function $T$ times faster than quantum processors, there is no time-advantage with using the quantum device. Furthermore, this argument assumes the same cost of parallelization for classical and quantum, which is optimistic for quantum devices. An example of this effect is in mining cryptocurrency [@aggarwal2018QuantumAttacksBitcoin]: while a quantum computer needs quadratically fewer attempts to succeed, the development of fast, specialized, classical hardware negates the advantage.


## NISQ implementations

The key can be encoded as the ground state of a Hamiltonian, and then [variational methods](../../quantum-algorithmic-primitives/variational-quantum-algorithms.md#variational-quantum-algorithms) are applied to solve for it. The scaling is expected to be the same as amplitude amplification. However, since the variational algorithm does not have a set time-complexity, the solution may be found much slower or faster [@wang2022VariationalSymmetricAttack]. If the fluctuations are large enough, they can potentially pose a challenge to cryptography, which makes worst-case guarantees. However, there is no reason to expect that the success probability will scale favorably with key size and compromise security in practice. Another approach is to use amplitude amplification, but adapt it to near-term devices, so that the NISQ-optimized versions perform better in real experiments [@zhang2022NISQSearch].


## Outlook

Here, we focused on the example of symmetric-key encryption. Nonetheless, the effect of amplitude amplification to halve the effective bits of security is generic for computational problems, assuming efficient construction of the oracle. From the cryptographic standpoint, this attack is mild and can be counteracted by doubling the number of bits of security in the scheme. In practice, the increase in key size can be unwieldy in certain applications, such as cryptocurrencies, but fundamental security is not threatened. 





