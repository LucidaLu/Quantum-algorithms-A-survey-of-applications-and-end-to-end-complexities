# Block-encoding dense matrices of classical data

## Rough overview (in words)

Many applications of quantum algorithms require access to large amounts of classical data, and in order to process this data on quantum devices, one needs coherent query access to the data. Block-encoding is a technique for importing classical data into quantum computers that provides exactly this type of coherent query access. Block-encodings work by encoding the matrices of classical data as blocks within larger matrices, which are defined such that the full encoding is a unitary operator. One way of thinking of this process is by "brute-force" compiling a unitary with the right structure, and then postselecting measurement outcomes to ensure the desired block of the unitary was applied. In general, block-encoding a dense matrix is not an efficient process, as one can typically expect multiplicative factors in the overhead that scale with system size (e.g., $\mathcal{O}\left( \mathrm{poly}(N) \right)$), and the process requires access to [QRAM](../../quantum-algorithmic-primitives/loading-classical-data/quantum-random-access-memory.md#quantum-random-access-memory), which can be prohibitively expensive. For a general treatment not restricted to dense classical data, see the article on [block-encoding](../../quantum-algorithmic-primitives/quantum-linear-algebra/block-encodings.md#block-encodings).


## Rough overview (in math)

Given an $N\times M$ matrix $A$, a block-encoding is a way of encoding the matrix $A$ as a block in a larger unitary matrix: $$\begin{equation} U_A = \begin{pmatrix}A/\alpha & \cdot \\ \cdot & \cdot \end{pmatrix} \end{equation}$$ We say that the unitary $U_A$ is an $(\alpha, a, \epsilon)$-block-encoding of the matrix $A\in\mathbb{C}^{N\times M}$ if $$\begin{equation} \left\lVert A - \alpha (\bra{0}^{\otimes a} \otimes I )U_A(\ket{0}^{\otimes a} \otimes I)\right\rVert \leq \epsilon, \end{equation}$$ where $a\in\mathbb{N}$ represents the number of ancilla qubits needed, $\alpha\in\mathbb{R}_+$ is a normalization constant, and $\epsilon\in\mathbb{R}_+$ is an error parameter. Note that the definition above holds for general matrices, even though additional embedding or padding may be needed.


In this section, we focus on the loading of classical matrices of data using a pair of [state preparation](../../quantum-algorithmic-primitives/loading-classical-data/preparing-states-from-classical-data.md#preparing-states-from-classical-data) unitaries [@gilyen2018QSingValTransfArXiv; @kerenidis2016QRecSys; @chakraborty2018BlockMatrixPowers]. In particular, the product $$\begin{equation} U_A=U_R^\dagger U_L \end{equation}$$ is an $(\alpha,a,\epsilon)$-block-encoding of $A$, where $U_L$ and $U_R$ are unitaries that perform state preparation, $\alpha$ is a normalization constant (which can be chosen depending on application, but a convenient choice is $\alpha=\nrm{A}_F$, the Frobenius norm of $A$), and $\epsilon$ is an error parameter that captures the error stemming from state preparation. In particular, the unitaries $U_L$ and $U_R$ prepare the states: $$\begin{equation} \label{eq:block-enc-state-prep} U_L\ket{0}\ket{i}=\ket{\psi_i}\qquad U_R\ket{0}\ket{j}=\ket{\phi_j}, \end{equation}$$ such that $A_{ij}=\braket{\psi_i}{\phi_j}$. The states $\ket{\psi_i}$ and $\ket{\phi_j}$ encode the (normalized) rows of $A$ and norms of those rows, respectively.


There are several methods of implementing the state preparation unitaries. One commonly used scheme involves constructing binary trees representing the amplitudes in the states $\ket{\psi_i}$ and $\ket{\phi_j}$ in Eq. $\eqref{eq:block-enc-state-prep}$, and building the state preparation unitaries out of controlled-$Y$ rotations by angles defined in those binary trees. In this way, one can construct an $\epsilon$-close approximation to the desired quantum state on $\log(N)$ qubits using $\mathcal{O}\left( N \right)$ qubits and $\mathcal{O}\left( \log^2(N/\epsilon) \right)$ $T$-depth. See the section on [preparing states from classical data](../../quantum-algorithmic-primitives/loading-classical-data/preparing-states-from-classical-data.md#preparing-states-from-classical-data) for more details. To load the data into a binary tree (for use in the state preparation step), a [QRAM](../../quantum-algorithmic-primitives/loading-classical-data/quantum-random-access-memory.md#quantum-random-access-memory) data structure can be employed. An improved state preparation approach was developed in [@clader2022resourcesForBlockEncoding] that quadratically improves the $T$-depth to $\mathcal{O}\left( \log(N/\epsilon) \right)$ by pre-applying all the single qubit rotations onto ancilla qubits, and then using a controlled-SWAP network to inject the ancillas appropriately.


## Dominant resource cost (gates/qubits)

In the case of general, dense matrices, detailed resource counts and implementations of block-encodings were studied in [@clader2022resourcesForBlockEncoding]. When building a block-encoding of a dense matrix $A$, one can optimize for reduced logical qubit count, $T$-depth, or $T$-count. In general, the dominant cost in terms of qubit counts comes from the state preparation step, requiring $\mathcal{O}\left( N \right)$ qubits. For $T$-depth, the dominant contribution comes from QRAM with a scaling that can range from $\mathcal{O}\left( \log(N) \right)$ to $\mathcal{O}\left( N \right)$, with a tradeoff between $T$-depth and qubit count described in [@low2018tradingTgatesforDirtyQubits]. If we focus on $T$-gates as the primary resource, the following dominant contributions to the complexities can be achieved:





|               |  **Optimized for min depth**   |               **Optimized for min count**               |
| :-—–—--: | :-—–—--—–—--—–--: | :-—–—--—–—--—–—--—–—--—–—-–-: |
| **\# Qubits** |            $4 N^2$             |                   $N\log(1/\epsilon)$                   |
| **$T$-Depth** | $10\log(N)+24\log(1/\epsilon)$ |         $8 N + 12 \log(N) (\log(1/\epsilon))^2$         |
| **$T$-Count** |    $12N^2\log(1/\epsilon)$     | $16N\log(1/\epsilon) + 12 \log(N) (\log(1/\epsilon))^2$ |





Detailed equations with accurate constants can be found in [@clader2022resourcesForBlockEncoding].


## Caveats

There are several ways of implementing block-encodings, even in the case of general matrices described above. The method is composed of two primitives: (*i*) [state preparation](../../quantum-algorithmic-primitives/loading-classical-data/preparing-states-from-classical-data.md#preparing-states-from-classical-data) and (*ii*) [QRAM](../../quantum-algorithmic-primitives/loading-classical-data/quantum-random-access-memory.md#quantum-random-access-memory). Each of those primitives have multiple options for implementation, and one can trade one resource for another. For instance, in the state preparation step, one can use the standard method of state preparation to a fixed precision $\epsilon$, or one can pre-compute the angles required for state preparation, and implement the controlled-rotations in a parallelized way, as mentioned above. The pre-rotated state preparation method requires a $T$-depth that scales as $\mathcal{O}(\log(N/\epsilon))$, whereas the traditional approach scales as $\mathcal{O}(\log(N)\log^2(1/\epsilon))$. Similarly, for the QRAM step there are several proposed implementations, including Select-SWAP [@low2018tradingTgatesforDirtyQubits] and Bucket-Brigade [@giovannetti2007QuantumRAM; @hann2021resilienceofQRAM], which have pros and cons based on architectural requirements. For instance, the Bucket-Brigade implementation can be more robust to noise than the Select-SWAP method, but Select-SWAP lends itself to a lower overall $T$-depth scaling.


Another important caveat is that block-encodings of dense classical data are not expected to be computationally efficient techniques. While one can tradeoff the time complexity (e.g., $T$-depth) with the number of ancilla qubits in the QRAM (such that the QRAM either requires $\mathcal{O}\left( \log(N) \right)$ $T$-depth with $\mathcal{O}\left( \mathrm{poly}(N) \right)$ qubits, or $\mathcal{O}\left( \mathrm{poly}(N) \right)$ $T$-depth with $\mathcal{O}\left( \log(N) \right)$ qubits), these are nevertheless expected to be prohibitive overhead costs for realistic problem sizes. See the section on [QRAM](../../quantum-algorithmic-primitives/loading-classical-data/quantum-random-access-memory.md#quantum-random-access-memory) for the caveats of using QRAM data structures. Moreover, the resource costs for block-encoding depend on norms of the matrix $A$, which could scale as $\mathcal{O}\left( \mathrm{poly}(N) \right)$, further nullifying any exponential speedup.


A final caveat to note is that if the matrix being block-encoded is sparse and efficiently row computable, or if the matrix enjoys some structure in the data in addition to sparsity, then more efficient block-encoding methods can be employed — see [block-encoding](../../quantum-algorithmic-primitives/quantum-linear-algebra/block-encodings.md#block-encodings) for details.


## Example use cases

In [financial portfolio optimization](../../areas-of-application/finance/portfolio-optimization.md#portfolio-optimization), classical data representing average historical returns and covariance matrices for a universe of assets is needed in a quantum algorithm for optimizing a portfolio. See, for example, [@dalzell2022socp].


## Further reading

- An excellent overview of block-encodings and quantum linear algebra: [@gilyen2018QSingValTransf]
- A detailed resource count of block-encoding with explicit circuits: [@clader2022resourcesForBlockEncoding]
- Select-SWAP QRAM and a tradeoff between qubit count and $T$-gates: [@low2018tradingTgatesforDirtyQubits] 





