# Quantum signal processing

## Rough overview (in words)

Quantum signal processing (QSP) [@low2016CompositeQuantGates] describes a method for nonlinear transformations of a signal parameter encoded in a single-qubit gate, using a structured sequence that interleaves the "signal gate" with fixed parametrized "modulation" gates. The technique was originally motivated by the desire to characterize pulse sequences used in nuclear magnetic resonance [@low2016CompositeQuantGates]. Remarkably, it has been shown [@low2016CompositeQuantGates; @haah2018ProdDecPerFuncQSignPRoc] that there is a rich family of polynomial transformations that are in one-to-one correspondence with appropriate modulation sequences, moreover given such a polynomial one can efficiently compute the corresponding modulation parameters.


Even more remarkably, this analysis holds not just for single-qubit "signal gates" but can be extended for multiqubit operators that *act* like single-qubit rotations when restricted to appropriate two-dimensional subspaces [@low2016HamSimQSignProc]. This insight enables the implementation of [block-encodings](../../quantum-algorithmic-primitives/quantum-linear-algebra/block-encodings.md#block-encodings) of polynomials of Hermitian/normal matrices when used in conjunction with [qubitization](../../quantum-algorithmic-primitives/quantum-linear-algebra/qubitization.md#qubitization). The two-step process of qubitization


+ QSP can be unified and generalized through [quantum singular value transformation](../../quantum-algorithmic-primitives/quantum-linear-algebra/quantum-singular-value-transformation.md#quantum-singular-value-transformation) (QSVT).


## Rough overview (in math)

We follow the "Wx convention" of QSP [@gilyen2018QSingValTransf; @martyn2021GrandUnificationQAlgs]. We define the single-qubit signal operator $$\begin{equation} W(x) := \begin{pmatrix} x & i \sqrt{1-x^2} \\ i \sqrt{1-x^2} & x \end{pmatrix} = e^{i \arccos(x) X} \end{equation}$$ which is a single-qubit $X$ rotation. We can verify that $$\begin{align} W(x)^2 & = \begin{pmatrix} 2x^2 - 1 & \cdot \\ \cdot & \cdot \end{pmatrix}, \\
W(x)^3 & = \begin{pmatrix} 4x^3 - 3x & \cdot \\ \cdot & \cdot \end{pmatrix}, \\
& \vdots \\
W(x)^n & = \begin{pmatrix} T_n(x) & \cdot \\ \cdot & \cdot \end{pmatrix}, \\
\end{align}$$ where $T_n(x)$ is the $n$-th Chebyshev polynomial of the first kind, showcasing that even a simple sequence of the signal unitaries can implement a rich family of polynomials of the signal $x$.


More complex behavior is obtained by interleaving $W(x)$ with parametrized single-qubit $Z$ rotations $e^{i \phi_j Z}$. We define a QSP sequence $$\begin{equation} U_{\mathrm{QSP}}(\Phi) := e^{i \phi_0 Z} \prod_{j=1}^d W(x) e^{i \phi_j Z}. \end{equation}$$ where $\Phi$ denotes the vector of angles $(\phi_0,\phi_1,\ldots,\phi_d)$. The QSP sequence implements the following unitary $$\begin{equation} \label{eq:UQSP(Phi)} U_{\mathrm{QSP}}(\Phi) = \begin{pmatrix} P(x) & i Q(x) \sqrt{1-x^2} \\ i Q^*(x) \sqrt{1-x^2} & P^*(x) \end{pmatrix} \end{equation}$$ where $P(x), Q(x)$ are complex polynomials obeying a number of constraints (see below), and $P^*(x)$, $Q^*(x)$ denote their complex conjugates.


## Dominant resource cost (gates/qubits)

A QSP circuit that implements a degree $d$ polynomial in the signal parameter requires $d$ uses of $W(x)$ and $d+1$ fixed angle $Z$ rotations. There are efficient classical algorithms to determine the angles for a given target polynomial, either using high-precision arithmetic with $\sim d\log(d)$ bits of precision [@haah2018ProdDecPerFuncQSignPRoc] (or more [@gilyen2018QSingValTransf]—though this can be mitigated using heuristic techniques [@chao2020FindingAngleSequences]) or in some regimes using more efficient optimization-based algorithms [@dong2020efficientPhaseFindingInQSP]. Although these procedures are efficient in theory, in practice it may still be nontrivial to find the angles. Nevertheless, researchers reportedly computed angle sequences corresponding to various degree $d = \mathcal{O}\left( 10^4 \right)$ polynomials.


## Caveats

As discussed above, not all polynomials can be implemented by a QSP sequence. Implementable polynomials must obey a number of constraints, which can be somewhat restrictive. For the standard QSP circuit $U_{\mathrm{QSP}}(\Phi)$ given above, the achievable polynomials pairs $P(x), Q(x) \in \mathbb{C}$ can be characterized by the following three conditions:


- $\mathrm{Deg}(P) \leq d$, $\mathrm{Deg}(Q) \leq d-1$.
- $\mathrm{Parity}(P) = \mathrm{Parity}(d)$, $\mathrm{Parity}(Q) = \mathrm{Parity}(d-1)$.
- $\forall~x \in [-1, 1]: |P(x)|^2 + (1-x^2) |Q(x)|^2 = 1$ (required for Eq. $\eqref{eq:UQSP(Phi)}$ to be unitary).


This last requirement can be particularly limiting. A useful way to circumvent this for real functions is to encode the polynomial in the matrix element $\bra{+} U_{\mathrm{QSP}}(\Phi) \ket{+}$ rather than in $\bra{0} U_{\mathrm{QSP}}(\Phi) \ket{0}$, where $\ket{+} = \smash{(\ket{0}+\ket{1})/\sqrt{2}}$. This matrix element evaluates to $$\begin{equation} \bra{+} U_{\mathrm{QSP}}(\Phi) \ket{+} = \operatorname{Re}[P(x)] + i\sqrt{1-\smash{x^2}} \operatorname{Re}[Q(x)]\,. \end{equation}$$ Given a real target polynomial $f(x)$ with parity equal to $\mathrm{Parity}(d)$, we can guarantee that the matrix element evaluates to $f(x)$ by choosing $\operatorname{Re}[P(x)] = f(x)$ and $\operatorname{Re}[Q(x)] = 0$. The third condition above then reduces to $1-f(x)^2 = \lvert \operatorname{Im}[P(x)]\rvert^2 + (1-x^2)\lvert \operatorname{Im}[Q(x)]\rvert^2$. By [@gilyen2018QSingValTransf Lemma 6], there exist choices for $\operatorname{Im}[P(x)]$ and $\operatorname{Im}[Q(x)]$ that satisfy this identity as well as the first two conditions above, provided $|f(x)| \leq 1~\forall~x \in [-1, 1]$. In summary, we may implement any real polynomial $f(x)$ satisfying the requirements [@gilyen2018QSingValTransf Corollary 10]:


- $\mathrm{Deg}(f) = d$.
- $\mathrm{Parity}(f) = \mathrm{Parity}(d)$.
- $\forall~x \in [-1, 1]: |f(x)| \leq 1$.


There are several related conventions considered in the literature for the explicit form of the single qubit operators used in QSP; a thorough discussion is given in [@martyn2021GrandUnificationQAlgs Appendix A]. One common form that links closely to [qubitization](../../quantum-algorithmic-primitives/quantum-linear-algebra/qubitization.md#qubitization) and [QSVT](../../quantum-algorithmic-primitives/quantum-linear-algebra/quantum-singular-value-transformation.md#quantum-singular-value-transformation) is the reflection convention, which replaces $W(x)$ by the reflection $$\begin{equation} \label{eq:QSPR} R(x) = \begin{pmatrix} x & \sqrt{1-x^2} \\ \sqrt{1-x^2} & -x \end{pmatrix} \,, \end{equation}$$ and adjusts the parameters $\{ \phi_j \}$ accordingly [@gilyen2018QSingValTransf].


## Example use cases

- Functions of Hermitian/normal matrices, in conjunction with [qubitization](../../quantum-algorithmic-primitives/quantum-linear-algebra/qubitization.md#qubitization), including for [Hamiltonian simulation](../../quantum-algorithmic-primitives/quantum-linear-algebra/quantum-signal-processing.md#quantum-signal-processingqubitization).
- Functions of general matrices via [quantum singular value transformation](../../quantum-algorithmic-primitives/quantum-linear-algebra/quantum-singular-value-transformation.md#quantum-singular-value-transformation) (QSVT).
- Reference [@dong2022BeyondMetrologyQSP] applied QSP to beyond-Heisenberg-limit calibration of two-qubit gates in a superconducting system.


## Further reading

- A pedagogical discussion of QSP [@martyn2021GrandUnificationQAlgs].
- Detailed proofs of the key results of QSP [@low2016CompositeQuantGates; @gilyen2018QSingValTransf].
- Lecture notes on QSP [@lin2022LectureNotes Sec. 7.6]. 





