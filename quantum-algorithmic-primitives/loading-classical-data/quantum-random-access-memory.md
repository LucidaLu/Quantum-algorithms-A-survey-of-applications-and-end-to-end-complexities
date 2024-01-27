# Quantum random access memory

## Rough overview (in words)

Quantum random access memory (QRAM) is a construction that enables coherent access to classical data, such that multiple different elements in a classical database can be read in superposition. The ability to rapidly access large, unstructured classical data sets in this way is crucial to the speedups of certain quantum algorithms (for example, [quantum machine learning based on quantum linear algebra](../../areas-of-application/machine-learning-with-classical-data/quantum-machine-learning-via-quantum-linear-algebra.md#quantum-machine-learning-via-quantum-linear-algebra)). QRAM is commonly invoked in such cases as a way to circumvent data-input bottlenecks [@aaronson2015ReadTheFinePrint], i.e. situations where loading input data could limit the end-to-end runtime of an algorithm. It remains an open question, however, whether a large-scale QRAM will ever be practical, casting doubt on quantum speedups that rely on QRAM. Note that, while here we focus on the more common use case of loading *classical* data with QRAM, certain QRAM architectures can be adapted to also load *quantum* data.


## Rough overview (in math)

Consider a length-$N$, unstructured classical data vector $x$, and denote the $i^\mathrm{th}$ entry as $x_i$. Let the number of bits of $x_i$ be denoted by $d$ and let $D = 2^d$. Given an input quantum state $\ket{\psi} = \sum_{i =0}^{N-1}\sum_{j=0}^{D-1}\alpha_{ij} \ket{i}_A \ket{j}_B$, QRAM is defined [@giovannetti2007QuantumRAM] as a unitary operation $Q$ with the action, $$\begin{equation} Q\ket{\psi} = Q\sum_{i =0}^{N-1}\sum_{j=0}^{D-1}\alpha_{ij} \ket{i}_A \ket{j}_B = \sum_{i =0}^{N-1}\sum_{j=0}^{D-1}\alpha_{ij} \ket{i}_A \ket{j \oplus x_i}_B. \label{eq:QRAM_definition} \end{equation}$$ Here, $A$ is a $\log_2(N)$-qubit register, and $B$ is a $d$-qubit register. Note that the unitary $Q$ can also be understood as an oracle (or black box) providing access to $x$, as $Q(\sum_i \alpha_i \ket{i}\ket{0}) = \sum_i \alpha_i \ket{i}\ket{x_i}$.


Let $T_Q$ denote the time it takes to implement the operation $Q$, where $T_Q$ can be measured in circuit depth, total gate cost, $T$-gate cost, etc., depending on the context. Algorithms that rely on QRAM to claim exponential speedups over their classical counterparts frequently assume that $T_Q = \mathrm{polylog} (N)$.


## Dominant resource cost (gates/qubits)

The QRAM operation $Q$ can be implemented as a quantum circuit that uses $\mathcal{O}\left( N \right)$ ancillary qubits and $\mathcal{O}\left( N \right)$ gates. Assuming gates acting on disjoint qubits can be parallelized, the depth of the circuit is only $T_Q = \mathcal{O}\left( \log(N) \right)$. Explicit circuits can be found in, e.g., [@dimatteo2020FaultTolerantQRAM; @hann2021resilienceofQRAM]. The number of ancillary qubits can be reduced at the price of increased circuit depth; circuits implementing $Q$ can be constructed using $\mathcal{O}\left( N/M \right)$ ancillary qubits and depth $\mathcal{O}\left( M\log(N) \right)$, where $M \in [1, N]$, see examples in [@low2018tradingTgatesforDirtyQubits; @Berry2019QubitizationOfArbitraryBasisChemistry; @dimatteo2020FaultTolerantQRAM; @hann2021resilienceofQRAM] (the setting of $M=N/\log(N)$ is sometimes referred to as "QROM\"—see terminology caveats below—and its fault-tolerant cost of implementation is well established [@babbush2018EncodingElectronicSpectraLinearT]).


Note that the above resource costs neglect the dependence on $d$ for simplicity, since different constructions yield different $d$ dependence. For example, the $d$ bits of a data element can be queried in series, requiring $\mathcal{O}\left( N \right)$ ancillary qubits with $T_Q = \mathcal{O}\left( d\log(N) \right)$ (improvement to $T_Q = \mathcal{O}\left( d+\log(N) \right)$ is possible for certain QRAM architectures [@chen2023efficient]). Alternatively, the $d$ bits can be accessed in parallel, with $T_Q = \mathcal{O}\left( \log(N) \right)$, but at the price of $\mathcal{O}\left( Nd \right)$ ancillary qubits.


## Caveats

The main concern for QRAM's practicality is the large hardware overhead that is necessary to realize fast queries $T_Q = \mathcal{O}\left( \log(N) \right)$. This cost is likely to be prohibitive for big-data applications where $N$ can be millions or billions. This cost will be magnified by additional overhead associated with [error correction](../../fault-tolerant-quantum-computation/quantum-error-correction-with-the-surface-code.md#quantum-error-correction-with-the-surface-code) and [fault tolerance](../../fault-tolerant-quantum-computation/basics-of-fault-tolerance.md#basics-of-fault-tolerance) [@dimatteo2020FaultTolerantQRAM], especially given that circuits implementing $Q$ are composed of $\mathcal{O}\left( N \right)$ non-Clifford gates. Indeed, the fact that $\mathcal{O}\left( N \right)$ non-Clifford gates are required, together with the assumption that [magic state distillation](../../fault-tolerant-quantum-computation/logical-gates-with-the-surface-code.md#logical-gates-with-the-surface-code) is expensive to run in a massively parallel fashion, has led some to argue that $T_Q = \mathcal{O}\left( \log(N) \right)$ is not realistic in a fault-tolerant setting. It is possible that alternative approaches to fault tolerance tailored to QRAM could help alleviate this large hardware overhead.


The fault-tolerance overhead may be reduced for the so-called bucket-brigade QRAM (BBQRAM) [@giovannetti2007QuantumRAM; @arunachalam2015RobustnessBuckBrigQRAM; @hann2021resilienceofQRAM]. BBQRAM can be understood as a family of circuits implementing $Q$ that are intrinsically resilient to noise. More precisely, [@hann2021resilienceofQRAM] shows that if $\epsilon$ is the per-gate error rate, BBQRAM circuits can implement $Q$ with leading-order fidelity $F \sim 1- \epsilon\, \mathrm{polylog}(N)$, while generic circuits implementing $Q$ have leading-order fidelity $F \sim 1- \epsilon\, \mathcal{O}\left( N \right)$. Nevertheless, some amount of error correction will almost certainly be required even for BBQRAM circuits.


Some terminology caveats:


- The unitary $Q$ is referred to by some as Quantum Read-Only Memory (QROM) [@babbush2018EncodingElectronicSpectraLinearT], reflecting the fact that $Q$ corresponds only to reading data. Some algorithms also require the ability to write to the vector $x$ duration a computation, but the writing of classical data need not be implemented via a quantum circuit.
- The term QRAM is used by different authors to refer to the unitary $Q$, families of circuits that implement $Q$, or quantum hardware that runs said circuits.
- Some use the term QRAM to refer exclusively to the case $N\gg 1$ and $T_Q = \mathrm{polylog} (N)$, where the implementation challenges for QRAM are most pronounced.
- The terms QRAM and QROM are sometimes synonymous with the cases of $T_Q = \mathrm{polylog}(N)$ and $T_Q = \mathrm{poly}(N)$, respectively, even though $T_Q$ is unrelated to the distinction between reading and writing. The term QROAM has also been used to describe intermediate circuits that trade off depth and width [@Berry2019QubitizationOfArbitraryBasisChemistry].


Elsewhere in this document, we follow the convention described in the final two bullet points above: usage of the term QRAM, unless specified otherwise, refers to the ability to implement $Q$ at cost $\mathrm{polylog}(N)$.


## Example use cases

- [Quantum linear algebra](../../quantum-algorithmic-primitives/quantum-linear-algebra/introduction.md#quantum-linear-algebra). QRAM can be used as an oracle implementation for linear algebra algorithms operating on unstructured data (e.g., by acting as a subroutine in a [block-encoding](../../quantum-algorithmic-primitives/quantum-linear-algebra/block-encodings.md#block-encodingsClassical)), with applications in [machine learning](../../areas-of-application/machine-learning-with-classical-data/introduction.md#machine-learning-with-classical-data), [finance](../../areas-of-application/finance/introduction.md#finance), etc. For example, the quantum recommendation systems algorithm [@kerenidis2016QRecSys] (now dequantized) uses QRAM as a subroutine to efficiently encode rows of an input data matrix in the amplitudes of quantum states (see Appendix A of [@kerenidis2016QRecSys] for details).
- [Hamiltonian simulation](../../quantum-algorithmic-primitives/hamiltonian-simulation/introduction.md#hamiltonian-simulation), [quantum chemistry](../../areas-of-application/quantum-chemistry/electronic-structure-problem.md#electronic-structure-problem), [condensed matter physics](../../areas-of-application/condensed-matter-physics/introduction.md#condensed-matter-physics). In the [linear combination of unitaries](../../quantum-algorithmic-primitives/quantum-linear-algebra/manipulating-block-encodings.md#linear-combinations) query model, QRAM can be used as a subroutine for "PREPARE" oracles that encode coefficients of the simulated Hamiltonian into the [amplitudes of quantum states](../../quantum-algorithmic-primitives/loading-classical-data/preparing-states-from-classical-data.md#preparing-states-from-classical-data) [@babbush2018EncodingElectronicSpectraLinearT]. These use cases typically consider the hybrid QROM/QRAM constructions with $\mathcal{O}\left( K \log(N) \right)$ ancillary qubits and depth $\mathcal{O}\left( N/K \right)$ (with $K$ a parameter to be optimized), because the amount of data (and thus the size of $N$) scales only polynomially with the system size.
- [Grover's search](../../quantum-algorithmic-primitives/amplitude-amplification-and-estimation/introduction.md#amplitude-amplification-and-estimation). QRAM can be used as an oracle implementation for Grover's oracle in the context of an unstructured database search, see Chapter 4 of [@nielsen2002QCQI]. This sort of Grover's search appears for example in quantum algorithms that utilize dynamic programming to give polynomial speedups for combinatorial optimization problems like the traveling salesman problem [@ambainis2019QSpeedUpExpTimeDPAlgs]. However, it has been argued that a quantum computer running Grover's algorithm with a QRAM oracle would not provide a speedup over a classical computer with comparable hardware resources [@steiger2016RacingInParallel].
- [Topological data analysis](../../areas-of-application/machine-learning-with-classical-data/topological-data-analysis.md#topological-data-analysis) (TDA). A small QRAM (i.e., not exponentially larger than the main quantum data register) is used in some quantum algorithms for TDA [@lloyd2016quantumTDA; @mcardle2022streamlinedTDA] in order to load the positions of the data points for computing whether simplices are present in the complex at a given length scale.


## Further reading

- Reference [@jaques2023qram] focuses on various fundamental and practical concerns for large-scale QRAM, while also providing a comprehensive survey of the field.
- Reference [@ciliberto2018QMLReview] provides an overview of practical concerns facing QRAM in the context of big-data applications (though the discussions of noise resilience there and in [@arunachalam2015RobustnessBuckBrigQRAM] are somewhat outdated, cf. [@hann2021resilienceofQRAM]). 





