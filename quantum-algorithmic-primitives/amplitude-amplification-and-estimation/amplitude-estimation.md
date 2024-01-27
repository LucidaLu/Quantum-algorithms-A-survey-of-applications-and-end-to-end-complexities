# Amplitude estimation

## Rough overview (in words)

Given a quantum subroutine that succeeds with unknown success probability, amplitude estimation performs [quantum phase estimation](../../quantum-algorithmic-primitives/quantum-phase-estimation.md#quantum-phase-estimation) on the operator used in [amplitude amplification](../../quantum-algorithmic-primitives/amplitude-amplification-and-estimation/amplitude-amplification.md#amplitude-amplification) to learn the magnitude of the success amplitude. While the algorithm is referred to as amplitude estimation, it is often the success probability that we wish to compute, and the complexity of the algorithm is often presented accordingly. For example, the original paper introducing amplitude estimation [@brassard2002AmpAndEst] uses the variable $a$ to denote the success probability. Here we denote the amplitude by $a$ and the success probability $p = |a|^2$. The algorithm provides a quadratic speedup over classical methods for estimating $p$.


## Rough overview (in math)

We are given an initial state $\ket{\psi_0}$, a target state $\ket{\psi_g}$, and a unitary $U$ (and its inverse $U^\dag$) such that $$\begin{equation} U\ket{\psi_0} = \ket{\psi} = a \ket{\psi_g} + b\ket{\psi_b} \end{equation}$$ where $\ket{\psi_b}$ is a state orthogonal to the target state. We assume that we can mark the target state $\ket{\psi_g}$ (i.e., the ability to reflect about the state). Thus, $|a|^2$ is the success probability of applying $U$ and measuring $\ket{\psi_g}$. We are given the ability to implement the reflection operator around the initial state $R_{\psi_0} = I - 2\ket{\psi_0}\bra{\psi_0}$ and an operation that, when restricted to the subspace spanned by $\{ \ket{\psi_g}, \ket{\psi_b} \}$, acts as the reflection around the target state $R_{\psi_g} = I - 2\ket{\psi_g}\bra{\psi_g}$. We can then estimate the success probability by performing quantum phase estimation on an operator $W = - U R_{\psi_0} U^\dag R_{\psi_g}$, from the initial state $U \ket{\psi_0} = \ket{\psi}$. The standard analysis [@brassard2002AmpAndEst] proceeds by letting $|a|=\sin(\theta)$ and $|b|=\cos(\theta)$ (thus the phases of $a$ and $b$ are absorbed into $\ket{\psi_g}$ and $\ket{\psi_b}$ and are not determined by the following procedure) and showing that the 2D subspace spanned by $\{\ket{\psi_g}, \ket{\psi_b}\}$ is invariant under $W$, where it acts as a rotation operator $$\begin{equation} W = \left[\begin{array}{cc} \cos(2\theta) & -\sin(2\theta) \\ \sin(2\theta) & \cos(2\theta) \end{array}\right]. \end{equation}$$ This operator has eigenvalues $e^{\pm 2 i \theta}$, and we can estimate $\theta$ to additive error $\epsilon$ through quantum phase estimation. The estimate for $\theta$ can be converted into an estimate for $|a|$, or for the success probability $p=|a|^2$, which is often the quantity of interest.


## Dominant resource cost (gates/qubits)

The classical approach for learning the probability $p$ to precision $\epsilon$ has time complexity $M = \mathcal{O}\left( 1/\epsilon^2 \right)$, where the basic idea is to perform $M$ incoherent repetitions of applying $U$ and measuring in the $\ket{\psi_g}, \ket{\psi_b}$ basis. Amplitude estimation provides a quadratic speedup, learning the probability (and amplitude) with time complexity $M = \mathcal{O}\left( 1/\epsilon \right)$. The textbook variant has a constant success probability, which can be boosted to $1-\delta$ with $\mathcal{O}\left( \log(1/\delta) \right)$ overhead through standard methods (e.g., probability amplification by majority voting).


More precisely, we can follow the analysis in [@brassard2002AmpAndEst] to show that to learn $|a|$ to error $\epsilon$ we require $M$ controlled applications of the walk operator $W$ where $M$ satisfies[^1] $$\begin{equation} \label{eq:AE_amplitude_bound} \epsilon \leq \frac{\pi \sqrt{1-a^2}}{M} + \frac{a\pi^2}{2M^2}. \end{equation}$$ The algorithm succeeds with probability $8/\pi^2$. We see that for $a \approx 1-\mathcal{O}\left( \epsilon \right)$, a further quadratic improvement is obtained (i.e., $M = \mathcal{O}\left( 1/\sqrt{\epsilon} \right)$).


To learn the success probability $p=|a|^2$ to error $\epsilon$ we require $M$ controlled applications of the walk operator $W$ where $M$ satisfies [@brassard2002AmpAndEst] $$\begin{equation} \label{eq:AE_probability_bound} \epsilon \leq \frac{2\pi \sqrt{p(1-p)}}{M} + \frac{\pi^2}{M^2}. \end{equation}$$ The algorithm succeeds with probability $8/\pi^2$. Similar to above, if $p \approx \mathcal{O}\left( \epsilon \right)$ or $p \approx 1-\mathcal{O}\left( \epsilon \right)$, we have that $M = \mathcal{O}\left( 1/\sqrt{\epsilon} \right)$.[^2]


A common setting is the case where $\ket{\psi_0} = \ket{\bar{0}}$, and $U$ acts on $n$ register qubits and $k$ ancilla qubits such that $U\ket{\bar{0}} = a\ket{\psi_g}\ket{\bar{0}}_k + b \ket{\psi_b}\ket{\bar{0}^\perp}_k$. In this case, the reflection operators are simple to implement, and $W$ can be controlled by making these reflections controlled (adding another control qubit to a multicontrol-CZ gate). We require $\log(M)$ ancilla qubits for phase estimation (which can be reduced using modern variants, see below and [@rall2022amplitude]).


## Caveats

The textbook version of amplitude estimation described above produces biased estimates of $|a|$ and $p$. This is partly inherited from the biased nature of textbook [quantum phase estimation (see caveats)](../../quantum-algorithmic-primitives/quantum-phase-estimation.md#quantum-phase-estimation). However, even if unbiased variants of phase estimation are used, the amplitude and probability estimates are not immediately unbiased, as they are obtained by applying nonlinear functions to the estimate of the phase. Unbiased variants of amplitude [@rall2022amplitude] and probability estimation [@apeldoorn2022TomographyStatePreparationUnitaries] have been developed to address this.


The variant of amplitude estimation described above is also "destructive" in the sense that the output state is collapsed into a state $\frac{1}{\sqrt{2}}(\pm i \ket{\psi_g} + \ket{\psi_b}) \neq \ket{\psi_0}, \ket{\psi}$. A nondestructive variant may be desired if the initial state is expensive to prepare and we require coherent or incoherent repetitions of amplitude estimation. Nondestructive variants have been developed in [@harrow2020QuantumSimulatedAnnealing; @cornelissen2022SublinearPartition; @rall2022amplitude].


## Example use cases

- Approximate counting of solutions marked by an oracle (e.g., [topological data analysis](../../areas-of-application/machine-learning-with-classical-data/topological-data-analysis.md#topological-data-analysis), [combinatorial optimization](../../areas-of-application/combinatorial-optimization/introduction.md#combinatorial-optimization)).
- Amplitude estimation provides a quadratic speedup for Monte Carlo estimation [@montanaro2015QMonteCarlo; @kothari2022MonteCarlo] with uses in [pricing financial assets](../../areas-of-application/finance/monte-carlo-methods-option-pricing.md#monte-carlo-methods-option-pricing). The general idea is to prepare a state $\ket{\psi} = \sum_x \sqrt{p(x) f(x)} \ket{x}\ket{0} + \ket{\phi 0^\perp}$ where $\mathbb{E}[f(x)] = \sum_x p(x) f(x)$ represents the expectation value we wish to evaluate using Monte Carlo sampling and corresponds to the probability that we measure the second register in state $\ket{0}$. Hence, amplitude estimation provides a quadratic speedup for estimating this quantity.
- A special case of amplitude estimation is overlap estimation [@knill2007ObservableMeasurement], where the goal is to measure $\bra{\psi_0} U \ket{\psi_0} = \braket{\psi}{\psi_0}$. This can be viewed as an application of amplitude amplification, where $\ket{\psi_g} = \ket{\psi_0}$. As a result, we only require the ability to implement $R_{\psi_0} = I - 2\ket{\psi_0}\bra{\psi_0}$, $U, U^\dag$ (or equivalently $R_{\psi_0}$ and $R_{\psi}$). Note that in overlap estimation, one additionally wants to determine the phase of $a$, which can be obtained by applying amplitude estimation on a controlled variant of $U$, as outlined in [@knill2007ObservableMeasurement]. Overlap estimation can be used for estimating observables, e.g., in [quantum chemistry](../../areas-of-application/quantum-chemistry/introduction.md#quantum-chemistry).
- A generalization of amplitude estimation, via the [quantum gradient algorithm](../../quantum-algorithmic-primitives/quantum-gradient-estimation.md#quantum-gradient-estimation), forms a core subroutine in some approaches for [quantum state tomography](../../quantum-algorithmic-primitives/quantum-tomography.md#quantum-tomography) [@apeldoorn2022TomographyStatePreparationUnitaries]. Pure state tomography can be thought of as a generalization of amplitude estimation, in which we seek to learn all amplitudes individually, rather than only a single aggregate quantity.


## Further reading

- Variants of amplitude estimation using fewer ancilla qubits (including ancilla-free approaches), or with depth-repetition tradeoffs have been proposed. For a summary of these approaches and their unification within the QSVT framework, see [@rall2022amplitude]. 






[^1]: Specifically, Lemma 7 of [@brassard2002AmpAndEst] shows that if $\theta = \arcsin(|a|)$ and $\tilde{\theta} = \arcsin(|\tilde{a}|)$, then $|\theta-\tilde{\theta}|\leq \eta$ implies $|a^2-\tilde{a}^2| \leq 2\eta\sqrt{a^2(1-a^2)}+\eta^2$. This is easily adapted to show that it also implies $|a-\tilde{a}|\leq \eta\sqrt{1-a^2} + a\eta^2/2$. They show that with probability at least $8/\pi^2$, $\theta$ is learned up to additive error at most $\eta = \pi/M$ with $M$ calls to $W$, which together with the above expressions implies Eqs. [\[eq:AE_amplitude_bound\]](#eq:AE_amplitude_bound){reference-type="eqref" reference="eq:AE_amplitude_bound"} and [\[eq:AE_probability_bound\]](#eq:AE_probability_bound){reference-type="eqref" reference="eq:AE_probability_bound"}.


[^2]: We can compare to the classical approach of estimating $p$ by flipping a $p$-biased coin $M$ times. Letting $\tilde{p}$ denote the estimate, which has mean $p$ and variance $p(1-p)/M$, Chebyshev's inequality implies that $|p-\tilde{p}|\leq \epsilon$ with probability at least $8/\pi^2$ as long as $M \geq C p(1-p)/\epsilon^2$ where $C = 1/(1-8/\pi^2)$. Thus, when $p \approx \mathcal{O}\left( \epsilon \right)$ or $p\approx 1-\mathcal{O}\left( \epsilon \right)$, the classical approach achieves $M \sim 1/\epsilon$, and the quantum speedup is never more than quadratic.

