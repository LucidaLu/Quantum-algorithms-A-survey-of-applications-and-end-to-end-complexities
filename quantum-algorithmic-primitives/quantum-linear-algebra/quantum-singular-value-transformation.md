# Quantum singular value transformation

## Rough overview (in words)

Quantum singular value transformation (QSVT) can be viewed as both a unification and generalization of [qubitization](../../quantum-algorithmic-primitives/quantum-linear-algebra/qubitization.md#qubitization) and [quantum signal processing](../../quantum-algorithmic-primitives/quantum-linear-algebra/quantum-signal-processing.md#quantum-signal-processing). Given a [block-encoding](../../quantum-algorithmic-primitives/quantum-linear-algebra/block-encodings.md#block-encodings) $U_A$ of a general matrix $A$, QSVT enables the transformation of the singular values of $A$ by a polynomial $f(\cdot)$. In QSVT there is one-to-one correspondence between the desired polynomial transformation and its quantum circuit implementation whose parameters can be found by efficient classical algorithms.


It transpires that a number of existing quantum algorithms have simple and (near-)optimal implementations via the QSVT framework, including but not limited to: [Hamiltonian simulation](../../quantum-algorithmic-primitives/quantum-linear-algebra/quantum-signal-processing.md#quantum-signal-processingqubitization) [@low2016HamSimQSignProc; @low2016HamSimQubitization; @gilyen2018QSingValTransf], [amplitude amplification and estimation](../../quantum-algorithmic-primitives/amplitude-amplification-and-estimation/introduction.md#amplitude-amplification-and-estimation) [@gilyen2018QSingValTransf; @rall2022amplitude], [quantum linear systems solving](../../quantum-algorithmic-primitives/quantum-linear-system-solvers.md#quantum-linear-system-solvers) [@gilyen2018QSingValTransf; @martyn2021GrandUnificationQAlgs], [Gibbs sampling](../../quantum-algorithmic-primitives/gibbs-sampling.md#gibbs-sampling) [@gilyen2018QSingValTransf], [algorithms for topological data analysis](../../areas-of-application/machine-learning-with-classical-data/topological-data-analysis.md#topological-data-analysis) [@hayakawa2021persistentBetti; @mcardle2022streamlinedTDA; @berry2022quantifyingTDA], and [quantum phase estimation](../../quantum-algorithmic-primitives/quantum-phase-estimation.md#quantum-phase-estimation) [@martyn2021GrandUnificationQAlgs; @Rall2021fastercoherent].


## Rough overview (in math)

We are given a $(1, m, 0)$-block-encoding $U_A$ of operator $A$ (for simplicity we will restrict our presentation to square matrices $A$, noting there is a straightforward generalization to non-square $A$ [@gilyen2018QSingValTransf]) such that $$\begin{equation} A= \left(\bra{0^m} \otimes I \right) U_A \left( \ket{0^m} \otimes I \right) \end{equation}$$ where $\ket{0^m}$ denotes $\ket{0}^{\otimes m}$. The matrix $A$ has a singular value decomposition (SVD) $$\begin{equation} A = \sum_i \sigma_i \ketbra{w_i}{v_i}. \end{equation}$$ QSVT provides a method for implementing $$\begin{equation} f^{(SV)}(A):=\left\{\begin{array}{rcl} \sum_i f(\sigma_i) \ketbra{w_i}{v_i} & & \text{if $f$ is odd, and} \\
\sum_i f(\sigma_i) \ketbra{v_i}{v_i} & & \text{if $f$ is even,}\end{array}\right. \end{equation}$$ for certain definite-parity polynomials $f\colon [-1,1] \rightarrow \mathbb{C}$ such that $|f(x)| \leq 1~\forall~x \in [-1,1]$. Crucially, QSVT does not require us to know the SVD in advance; the transformation is carried out automatically by following an SVD-agnostic procedure outlined below. Note that $f^{(SV)}(A)$ only coincides with the matrix function $f(A)$ for Hermitian $A$ (see Caveats). In the Hermitian case, we can also obtain block-encodings of mixed-parity or complex functions by taking [linear combinations of block-encodings](../../quantum-algorithmic-primitives/quantum-linear-algebra/manipulating-block-encodings.md#manipulating-block-encodings)—see [@dong2020efficientPhaseFindingInQSP] for examples.


By considering $U_A \ket{0^m} \ket{v_i}$ and $U_A^\dagger \ket{0^m}\ket{w_i}$ one can show that (see [@lin2022LectureNotes] for a step-by-step derivation) $U_A$ and $U_A^\dagger$ act as linear maps between the 2D subspaces $S_i:=\mathrm{Span}\{\ket{0^m}\ket{v_i},\ket{\perp_i}\} \rightarrow S_i':=\mathrm{Span}\{\ket{0^m}\ket{w_i},\ket{\perp_i'}\}$, and $U_A$'s transition matrix between these bases is 
$$
\begin{aligned}\label{eq:SVD2D}
	\ket{0^m} \ket{v_i}\ \ \ \ \ \ \ \ \  \   \ket{\perp_i}\ \ \ \ \ \ \\
\begin{gathered}\ket{0^m} \ket{w_i}\\
\ket{\perp_i'}\end{gathered}
\begin{pmatrix} \sigma_i & \sqrt{1-\sigma_i^2} \\
\sqrt{1-\sigma_i^2}& -\sigma_i \end{pmatrix}
\end{aligned}
$$
where both $\ket{\perp_i}, \ket{\perp_i'}$ are orthogonal to $\ket{0^m}$ (but not necessarily to each other).[^1] One can show that $S_i$ is invariant under the operation $W := Z_{\ket{0^m}} U_A^\dag Z_{\ket{0^m}} U_A$ (with $Z_{\ket{0^m}} = (2\ketbra{0^m}{0^m} - I)$) having matrix $$\begin{equation} \left(\begin{array}{cc} \sigma_i & \sqrt{1-\sigma_i^2} \\ - \sqrt{1-\sigma_i^2} & \sigma_i \end{array}\right)^{\!\!2} \end{equation}$$ when restricted onto the 2D subspace $S_i$. An additional application of $Z_{\ket{0^m}} U_A$ maps back into the $S_i'$ subspace. By analogy with [qubitization](../../quantum-algorithmic-primitives/quantum-linear-algebra/qubitization.md#qubitization), repeated applications of $W$ applies a Chebyshev polynomial to each of the singular values of $A$. In analogy with [quantum signal processing](../../quantum-algorithmic-primitives/quantum-linear-algebra/quantum-signal-processing.md#quantum-signal-processing), by lifting the $Z_{\ket{0^m}}$ reflection operation to a (controlled) rotation $e^{i\phi_j Z_{\ket{0^m}}}$ we can impose polynomial transformations of the singular values of $A$, which then induces the claimed polynomial transformation of $A$. It is typically convenient to use an additional ancilla qubit to implement $e^{i\phi_j Z_{\ket{0^m}}}$.


We define a QSVT circuit as the unitary sequence $$\begin{equation} U_\Phi:=\left\{\begin{array}{rcl} \underset{\phantom{\sum}}{ e^{i\phi_1 Z_{\ket{0^m}}}U_A} \prod_{j=1}^{(d-1)/2}\left(e^{i\phi_{2j} Z_{\ket{0^m}}} U_A^\dagger e^{i\phi_{2j+1} Z_{\ket{0^m}}} U_A\right) & & \text{if }d\text{ is odd, and} \\
\prod_{j=1}^{d/2}\left(e^{i\phi_{2j-1} Z_{\ket{0^m}}} U_A^\dagger e^{i\phi_{2j} Z_{\ket{0^m}}} U_A \right) & & \text{if }d\text{ is even,}\end{array}\right. \end{equation}$$ where $\Phi = (\phi_1,\phi_2,\ldots,\phi_d)$. We have that $$\begin{align} (\bra{0^m} \otimes I) U_\Phi (\ket{0^m} \otimes I) =P^{(SV)}(A) = \left\{\begin{array}{rl} & \sum_i P(\sigma_i) \ketbra{w_i}{v_i}, \text{ for odd $d$, and} \\
& \sum_i P(\sigma_i) \ketbra{v_i}{v_i}, \text{ for even $d$,}\end{array}\right. \end{align}$$ i.e., the unitary $U_\Phi$ is a block-encoding of $P^{(SV)}(A)$, were $P$ is the same polynomial that appears in [quantum signal processing](../../quantum-algorithmic-primitives/quantum-linear-algebra/quantum-signal-processing.md#quantum-signal-processing) because the 2D matrix of $\eqref{eq:SVD2D}$ has the same form as the analogous 2D matrix in $\eqref{eq:QSPR}$. We note that the constraints on the polynomials typically preclude direct implementation of the desired function as outlined above. By exploiting that $-\Phi$ implements $P^*$, we can use the circuit shown in Fig. [1](#fig:QSVT){reference-type="ref" reference="fig:QSVT"} to implement a block-encoding of 

$$\begin{equation} P_{\Re}(A) = (\bra{+} \otimes \bra{0^m} \otimes I) (\ketbra{0}{0} \otimes U_\Phi + \ketbra{1}{1} \otimes U_{-\Phi}) (\ket{+} \otimes \ket{0^m} \otimes I) \end{equation}$$ 
for any definite-parity polynomial $P_{\Re}\colon [-1,1]\rightarrow [-1,1]$ by appropriately choosing $\Phi$ to implement a complex polynomial that fulfills the QSP conditions and then taking linear combinations of $U_{\Phi}, U_{-\Phi}$ to give a block-encoding of $P_{\Re}(A)$ [@gilyen2018QSingValTransf; @martyn2021GrandUnificationQAlgs; @dong2020efficientPhaseFindingInQSP].


![1: The QSVT circuit $U_\Phi$ which transforms a block-encoding $U_A$ of $A$ into a block-encoding of $f(A)$ for definite-parity $f: [-1,1]\rightarrow [-1,1]$ polynomial of degree $d$. As discussed in the main text, the angles $\{\phi_i\}$ can be calculated using efficient classical algorithms.](../../figures/qcirc/6.png){#fig:QSVT}


## Dominant resource cost (gates/qubits)

Given a degree-$d$ even-parity polynomial $f\colon [-1,1]\rightarrow [-1,1]$ and a $(1,m,0)$-[block-encoding](../../quantum-algorithmic-primitives/quantum-linear-algebra/block-encodings.md#block-encodings) $U_A$ of $A$, one can implement a block-encoding of $f(A)$ using $d/2$ calls to $U_A$, $d/2$ calls to $U_A^\dagger$, $2d$ $m$-controlled Toffoli gates, and $d$ single-qubit $Z$ rotations (as shown in Fig. [1](#fig:QSVT){reference-type="ref" reference="fig:QSVT"}). Implementing a degree $d+1$ odd polynomial additionally requires another call to $U_A$, another two $m$-controlled Toffoli gate, and another single-qubit $Z$ rotation. The QSVT circuit implements a $(1, m+1, 0)$-block-encoding of $f(A)$.


If $U_A$ is imperfect (i.e., it is a $(1, m, \epsilon)$-block-encoding of $A$), then [@gilyen2018QSingValTransf Lemma 22] shows that the error in $f(A)$ is bounded by $4d\sqrt{\epsilon}$; that is, QSVT implements a $(1, m+1, 4d\sqrt{\epsilon})$-block-encoding of $f(A)$. Moreover, if the norm of $A$ is bounded away from $1$, e.g., $\nrm{A}\leq 1/2$, then the perturbation bound can be improved to $\mathcal{O}\left( d\epsilon \right)$ [@gilyen2018QSingValTransf Lemma 23].


Given an initial state $\ket{\psi}$, the success probability of implementing $f(A) \ket{\psi}$ is given by $|\bra{\psi} f(A)^\dag f(A) \ket{\psi}|^2$.


## Caveats

Since the output must be subnormalized to ensure the existence of a unitary block-encoding of $f(A)$, $f$ must satisfy $|f(x)| \leq 1~\forall~x \in [-1,1]$


As noted above, $f^{(SV)}(A)$ is only guaranteed to coincide with the matrix function $f(A)$ for Hermitian $A$. As an example, choosing $f(x) = x^2$ we have $f^{(SV)}(A) = \sum_i \sigma_i^2 \ketbra{v_i} {v_i}=A^\dagger A$ whereas $A^2 = \sum_{i,j} \sigma_i \sigma_j \ket{w_i}\braket{v_i}{ w_j}\bra{v_j}$. As discussed above, for the Hermitian case we can implement a block-encoding of a mixed-parity function $f$ by taking linear combinations of block-encodings of its even/odd parts. However, in the general case when $\ket{w_i}$ and $\ket{v_i}$ do not coincide, it does not seem to be possible to remove the parity constraint, as the odd $\sum_i f_{\mathrm{odd}}(\sigma_i) \ketbra{w_i}{v_i}$ and even $\sum_i f_{\mathrm{even}}(\sigma_i) \ketbra{v_i}{v_i}$ singular value transforms potentially map to different subspaces.


As discussed for [quantum signal processing](../../quantum-algorithmic-primitives/quantum-linear-algebra/quantum-signal-processing.md#quantum-signal-processing), while formally efficient classical algorithms have been developed for computing the angle sequence $\Phi$, these either require very high accuracy arithmetics [@gilyen2018QSingValTransf; @haah2018ProdDecPerFuncQSignPRoc], or use alternative methods with only partially proven guarantees [@dong2020efficientPhaseFindingInQSP; @chao2020FindingAngleSequences]. Nevertheless, these approaches have enabled the computation of angle sequences for polynomials of degree up to $\sim10^4$.


As noted above, if $f(A)$ has small singular values, then preparing the a quantum sate $f(A)\ket{\psi}$ might require many repeated uses of its block-encoding, thus the normalization factor of $f$ plays a crucial role in efficiency.


In many applications, one seeks to apply a function that is not a polynomial (e.g., $e^x$, $e^{ix}$, $\mathrm{erf}(x)$). In such cases, one needs to first approximate the desired function by a polynomial (incurring an approximation error $\epsilon$) in order to apply QSVT.


## Example use cases

- [Linear equation solving](../../quantum-algorithmic-primitives/quantum-linear-system-solvers.md#quantum-linear-system-solvers): apply a polynomial approximation of $\frac{1}{x}$ to a block-encoding of $A^\dagger$ to get an approximate block-encoding of the pseudoinverse $A^+$.
- [Hamiltonian simulation](../../quantum-algorithmic-primitives/quantum-linear-algebra/quantum-signal-processing.md#quantum-signal-processingqubitization): apply polynomial approximations of $\sin(x)$ and $\cos(x)$ to a block-encoding of a Hamiltonian $H$ and combine them with [linear combination of unitaries](../../quantum-algorithmic-primitives/quantum-linear-algebra/manipulating-block-encodings.md#linear-combinations) and [amplitude amplification](../../quantum-algorithmic-primitives/amplitude-amplification-and-estimation/amplitude-amplification.md#amplitude-amplification) to obtain a block-encoding of $e^{iHt}$.
- [Fixed-point amplitude amplification](../../quantum-algorithmic-primitives/amplitude-amplification-and-estimation/introduction.md#amplitude-amplification-and-estimation) [@yoder2014FixedPointSearch]: construct a polynomial that maps values in the domain $[a_{\min},1]$ to the range $[1-\delta,1]$, and apply this polynomial to a state-preparation unitary that prepares the desired state with amplitude $a$. The result is amplification of the amplitude to at least $1-\delta$ as long as $a > a_{\min}$.
- For additional applications see [@gilyen2018QSingValTransf; @Rall2021fastercoherent; @martyn2021GrandUnificationQAlgs; @lin2019OptimalQEigenstateFiltering; @lin2020NearOptimalGroundState].


## Further reading

- The QSVT framework was introduced in [@gilyen2018QSingValTransf] and is also discussed in detail in [@gilyen2018QSingValTransfThesis].
- A pedagogical tutorial of the QSVT framework is given in [@martyn2021GrandUnificationQAlgs; @lin2022LectureNotes].
- A streamlined derivation of QSVT is presented in [@tang2023CSguideQSVT]. 






[^1]: If $\sigma_i=1$, then there is no need for $\ket{\perp_i}, \ket{\perp_i'}$, and the subspaces $S_i$, $S_i'$ become one dimensional.

